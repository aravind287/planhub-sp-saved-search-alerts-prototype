export interface ProjectDocument {
  id: string
  name: string
  type: "Plans" | "Specifications" | "Addendum" | "Contract" | "RFI"
  pages: number
  matchedKeywords: string[]
  matchSections: string[]
}

// Dummy documents for projects that have "Matches Found"
export const PROJECT_DOCUMENTS: Record<string, ProjectDocument[]> = {
  p1:  securityDocs(["CCTV", "surveillance", "security camera", "access control"]),
  p2:  securityDocs(["access control", "security camera", "card reader"]),
  p3:  securityDocs(["access control", "card reader", "security system", "intercom"]),
  p4:  securityDocs(["CCTV", "surveillance", "security camera"]),
  p5:  securityDocs(["intrusion detection", "alarm", "security system"]),
  p6:  securityDocs(["CCTV", "access control", "security camera", "surveillance"]),
  p7:  securityDocs(["CCTV", "surveillance", "security camera"]),
  p8:  securityDocs(["access control", "card reader", "intercom", "security camera"]),
  p9:  securityDocs(["access control", "card reader", "security system"]),
  p10: securityDocs(["access control", "security camera", "intercom", "surveillance"]),
  p11: securityDocs(["CCTV", "surveillance", "intrusion detection"]),
  p12: securityDocs(["security camera", "access control", "surveillance"]),
  p13: securityDocs(["alarm", "intrusion detection", "security system"]),
  p14: securityDocs(["access control", "security camera", "card reader"]),
  p15: securityDocs(["CCTV", "surveillance", "security camera"]),
  p16: securityDocs(["access control", "security camera", "intercom"]),
  p17: securityDocs(["access control", "alarm", "security system"]),
  p18: securityDocs(["access control", "CCTV", "security camera"]),
  p19: securityDocs(["surveillance", "CCTV", "security camera"]),
  p20: securityDocs(["access control", "card reader", "security camera", "surveillance"]),
  p33: generalDocs(["renovation", "ADA"]),
  p35: generalDocs(["structural steel", "office"]),
  p38: generalDocs(["mixed-use", "residential"]),
  p43: generalDocs(["senior living", "new construction"]),
  p45: generalDocs(["restaurant", "TI"]),
  p46: securityDocs(["security camera", "access control", "alarm"]),
  p53: securityDocs(["CCTV", "surveillance", "security camera"]),
  p54: securityDocs(["access control", "security camera", "intrusion detection"]),
  p58: securityDocs(["alarm", "intrusion detection", "security system"]),
  p61: securityDocs(["security camera", "CCTV", "access control"]),
  p64: securityDocs(["access control", "security camera", "intrusion detection"]),
  p70: securityDocs(["security camera", "access control", "card reader"]),
  p71: securityDocs(["CCTV", "surveillance", "security camera"]),
  p75: securityDocs(["access control", "security camera", "surveillance"]),
  p77: generalDocs(["HVAC", "alarm", "security system"]),
  p81: securityDocs(["security camera", "access control", "surveillance"]),
  p85: securityDocs(["intrusion detection", "access control", "alarm"]),
  p87: securityDocs(["CCTV", "security camera", "access control"]),
  p91: securityDocs(["CCTV", "surveillance", "security camera", "access control"]),
  p92: securityDocs(["security camera", "access control", "intrusion detection"]),
  p95: securityDocs(["security camera", "access control", "alarm"]),
  p96: securityDocs(["CCTV", "surveillance", "security camera"]),
  p99: generalDocs(["alarm", "intrusion detection", "security system"]),
  p101: securityDocs(["security camera", "access control", "CCTV"]),
  p104: securityDocs(["security camera", "access control", "intercom"]),
  p107: securityDocs(["security camera", "CCTV", "access control"]),
  p109: securityDocs(["access control", "security camera", "intercom"]),
  p110: securityDocs(["CCTV", "surveillance", "security camera", "access control"]),
  p111: securityDocs(["security camera", "access control", "surveillance"]),
  p112: securityDocs(["intrusion detection", "alarm", "security system"]),
  p115: securityDocs(["access control", "card reader", "security camera"]),
  p119: securityDocs(["security camera", "CCTV", "surveillance"]),
  p120: securityDocs(["access control", "security camera", "intrusion detection"]),
}

function securityDocs(keywords: string[]): ProjectDocument[] {
  return [
    {
      id: "doc-spec",
      name: "Division 28 – Electronic Safety and Security",
      type: "Specifications",
      pages: 48,
      matchedKeywords: keywords.slice(0, 3),
      matchSections: ["Section 28 10 00 – Access Control", "Section 28 20 00 – Video Surveillance", "Section 28 30 00 – Intrusion Detection"],
    },
    {
      id: "doc-plans",
      name: "Security System Plans – Floor Plans & Riser Diagrams",
      type: "Plans",
      pages: 22,
      matchedKeywords: keywords.slice(0, 2),
      matchSections: ["Sheet E-701 Security Floor Plan", "Sheet E-702 Camera Coverage Plan", "Sheet E-703 Riser Diagram"],
    },
    {
      id: "doc-contract",
      name: "Contract Documents & General Conditions",
      type: "Contract",
      pages: 64,
      matchedKeywords: keywords.slice(0, 1),
      matchSections: ["Article 11 – Scope of Work", "Exhibit B – Equipment Schedule"],
    },
    {
      id: "doc-addendum",
      name: "Addendum No. 1 – Security Scope Clarifications",
      type: "Addendum",
      pages: 6,
      matchedKeywords: keywords,
      matchSections: ["Clarification 3 – Camera Placement", "Clarification 7 – Access Reader Types"],
    },
  ]
}

function generalDocs(keywords: string[]): ProjectDocument[] {
  return [
    {
      id: "doc-spec",
      name: "Project Specifications – Full Set",
      type: "Specifications",
      pages: 312,
      matchedKeywords: keywords.slice(0, 2),
      matchSections: ["Division 01 – General Requirements", "Division 23 – HVAC", "Division 26 – Electrical"],
    },
    {
      id: "doc-plans",
      name: "Construction Documents – Architectural & MEP",
      type: "Plans",
      pages: 88,
      matchedKeywords: keywords.slice(0, 1),
      matchSections: ["Sheet A-101 Floor Plan", "Sheet M-201 Mechanical Plan", "Sheet E-101 Electrical Plan"],
    },
    {
      id: "doc-contract",
      name: "Contract Documents & General Conditions",
      type: "Contract",
      pages: 64,
      matchedKeywords: keywords.slice(0, 1),
      matchSections: ["Article 3 – Contract Sum", "Article 11 – Insurance"],
    },
  ]
}
