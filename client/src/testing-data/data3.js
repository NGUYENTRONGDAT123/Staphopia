// export const data3 = require("./company.json");
export const data3 = {
  nodes: [
    { id: "blaZ", contigId: "01", subclass: "BETA-LACTAM" },
    { id: "blaR1", contigId: "01", subclass: "BETA-LACTAM" },
    { id: "blaI", contigID: "02", subclass: "BETA-LACTAM" },
    { id: "tet(38)", contigID: "03", subclass: "TERA" },
    { id: "fosB", contigID: "03", subclass: "FOSOMYCIN" },
  ],
  links: [
    { source: "blaZ", target: "blaR1", contigID: "01" },
    { source: "tet(38)", target: "fosB", contigID: "03" },
  ],
};
