export const AmrPdfDefinition = (amrSample) => {
  return {
    content: ["header", { text: "Export pdf", style: "textStyle" }],
    styles: {
      textStyle: { fontSize: 22, bold: true },
    },
  };
};
