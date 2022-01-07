import React from "react";
import { Table } from "antd";

// define columns in AMR table
const columns = [
  {
    title: "Gene Symbol",
    dataIndex: "Gene symbol",
    key: "geneSymbol",
  },
  {
    title: "Contig ID",
    dataIndex: "Contig id",
    key: "contigId",
  },
  {
    title: "Class",
    dataIndex: "Class",
    key: "class",
  },
  {
    title: "Sub-class",
    dataIndex: "Subclass",
    key: "subClass",
  },
  {
    title: "Method",
    dataIndex: "Method",
    key: "method",
  },
  {
    title: "Identity Percentage",
    dataIndex: "% Identity to reference sequence",
    key: "itentity",
  },
  {
    title: "Length",
    dataIndex: "Target length",
    key: "targetLength",
  },
];

export default function AmrTable({ data }) {
  return (
    <Table
      dataSource={data}
      columns={columns}
      bordered
      size="middle"
      pagination={false}
      scroll={{ x: "calc(700px + 50%)", y: 420 }}
      style={{ height: "400px" }}
    />
  );
}

