export const AmrPdfDefinition = (amrSample) => {
  return {
    content: ["header", { text: "aloalo", style: "textStyle" }],
    styles: {
      textStyle: { fontSize: 22, bold: true },
    },
  };
};
