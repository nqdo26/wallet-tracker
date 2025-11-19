import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import dayjs from "dayjs";

(pdfMake as any).vfs = pdfFonts;

interface TransactionData {
  date: string;
  type: string;
  amount: number;
  category: string;
  walletName?: string;
  note?: string;
}

interface StatementData {
  date: string;
  type: string;
  amount: number;
  category: string;
  balanceAfter: number;
  note?: string;
}

export const exportTransactionsPDF = (
  transactions: TransactionData[],
  dateRange?: { start: string; end: string }
) => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const docDefinition: any = {
    content: [
      {
        text: "BÁO CÁO GIAO DỊCH",
        style: "header",
        alignment: "center",
      },
      dateRange
        ? {
            text: `Từ ${dayjs(dateRange.start).format(
              "DD/MM/YYYY"
            )} đến ${dayjs(dateRange.end).format("DD/MM/YYYY")}`,
            style: "subheader",
            alignment: "center",
            margin: [0, 5, 0, 20],
          }
        : { text: "", margin: [0, 0, 0, 10] },
      {
        columns: [
          {
            width: "*",
            text: [
              { text: "Tổng thu: ", bold: true },
              `${totalIncome.toLocaleString("vi-VN")} ₫\n`,
              { text: "Tổng chi: ", bold: true },
              `${totalExpense.toLocaleString("vi-VN")} ₫\n`,
              { text: "Chênh lệch: ", bold: true },
              `${(totalIncome - totalExpense).toLocaleString("vi-VN")} ₫`,
            ],
            style: "summary",
          },
        ],
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "auto", "auto", "*", "auto", "*"],
          body: [
            [
              { text: "Ngày", style: "tableHeader" },
              { text: "Loại", style: "tableHeader" },
              { text: "Số tiền (₫)", style: "tableHeader" },
              { text: "Danh mục", style: "tableHeader" },
              { text: "Ví", style: "tableHeader" },
              { text: "Ghi chú", style: "tableHeader" },
            ],
            ...transactions.map((t) => [
              dayjs(t.date).format("DD/MM/YYYY"),
              t.type === "income" ? "Thu" : "Chi",
              t.amount.toLocaleString("vi-VN"),
              t.category,
              t.walletName || "",
              t.note || "",
            ]),
          ],
        },
        layout: {
          fillColor: (rowIndex: number) => {
            return rowIndex === 0
              ? "#2980b9"
              : rowIndex % 2 === 0
              ? "#f5f5f5"
              : null;
          },
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#ddd",
          vLineColor: () => "#ddd",
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 11,
      },
      summary: {
        fontSize: 10,
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "white",
      },
    },
    defaultStyle: {
      font: "Roboto",
      fontSize: 9,
    },
  };

  const fileName = `bao-cao-giao-dich-${dayjs().format("DDMMYYYY-HHmmss")}.pdf`;
  pdfMake.createPdf(docDefinition).download(fileName);
};

export const exportWalletStatementPDF = (
  walletName: string,
  statements: StatementData[],
  initialBalance: number
) => {
  const finalBalance =
    statements.length > 0
      ? statements[statements.length - 1].balanceAfter
      : initialBalance;

  const docDefinition: any = {
    content: [
      {
        text: "SỔ GIAO DỊCH VÍ",
        style: "header",
        alignment: "center",
      },
      {
        text: `Ví: ${walletName}`,
        style: "subheader",
        alignment: "center",
        margin: [0, 5, 0, 20],
      },
      {
        columns: [
          {
            width: "*",
            text: [
              { text: "Số dư ban đầu: ", bold: true },
              `${initialBalance.toLocaleString("vi-VN")} ₫\n`,
              { text: "Số dư cuối: ", bold: true },
              `${finalBalance.toLocaleString("vi-VN")} ₫`,
            ],
            style: "summary",
          },
        ],
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "auto", "auto", "*", "auto", "*"],
          body: [
            [
              { text: "Ngày", style: "tableHeader" },
              { text: "Loại", style: "tableHeader" },
              { text: "Số tiền (₫)", style: "tableHeader" },
              { text: "Danh mục", style: "tableHeader" },
              { text: "Số dư sau (₫)", style: "tableHeader" },
              { text: "Ghi chú", style: "tableHeader" },
            ],
            ...statements.map((s) => [
              dayjs(s.date).format("DD/MM/YYYY HH:mm"),
              s.type === "income" ? "Thu" : "Chi",
              s.amount.toLocaleString("vi-VN"),
              s.category,
              s.balanceAfter.toLocaleString("vi-VN"),
              s.note || "",
            ]),
          ],
        },
        layout: {
          fillColor: (rowIndex: number) => {
            return rowIndex === 0
              ? "#3498db"
              : rowIndex % 2 === 0
              ? "#f5f5f5"
              : null;
          },
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#ddd",
          vLineColor: () => "#ddd",
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 12,
      },
      summary: {
        fontSize: 10,
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "white",
      },
    },
    defaultStyle: {
      font: "Roboto",
      fontSize: 9,
    },
  };

  const fileName = `thong-ke-chi-tieu-vi-${walletName.replace(/\s+/g, "-")}-${dayjs().format(
    "DDMMYYYY-HHmmss"
  )}.pdf`;
  pdfMake.createPdf(docDefinition).download(fileName);
};
