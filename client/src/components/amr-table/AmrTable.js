import React from 'react';
import {Table, Tag} from 'antd';

const columns = [
  {
    title: 'Gene Symbol',
    dataIndex: 'Gene symbol',
    key: 'geneSymbol',
  },
  {
    title: 'Contig ID',
    dataIndex: 'Contig id',
    key: 'contigId',
  },
  {
    title: 'Class',
    dataIndex: 'Class',
    key: 'class',
  },
  {
    title: 'Sub-class',
    dataIndex: 'Subclass',
    key: 'subClass',
  },
  {
    title: 'Method',
    dataIndex: 'Method',
    key: 'method',
  },
  {
    title: 'Indentity Percentage',
    dataIndex: '% Identity to reference sequence',
    key: 'itentity',
  },
  {
    title: 'Length',
    dataIndex: 'Target length',
    key: 'targetLength',
  },
];

const tableData = [
  {
    _id: '60f4f9547b83af5fcaa35696',
    Name: '100.csv',
    'Contig id': 'contig23',
    Start: '6367',
    Stop: '7209',
    Strand: '-',
    'Gene symbol': 'blaZ',
    'Sequence name': 'penicillin-hydrolyzing class A beta-lactamase BlaZ',
    Scope: 'core',
    'Element type': 'AMR',
    'Element subtype': 'AMR',
    Class: 'BETA-LACTAM',
    Subclass: 'BETA-LACTAM',
    Method: 'EXACTX',
    'Target length': '281',
    'Reference sequence length': '281',
    '% Coverage of reference sequence': '100',
    '% Identity to reference sequence': '100',
    'Alignment length': '281',
    'Accession of closest sequence': 'WP_000733289.1',
    'Name of closest sequence': 'penicillin-hydrolyzing class A beta-lactamase BlaZ',
  },
  {
    _id: '60f4f9547b83af5fcaa35699',
    Name: '100.csv',
    'Contig id': 'contig4',
    Start: '67054',
    Stop: '68403',
    Strand: '+',
    'Gene symbol': 'tet(38)',
    'Sequence name': 'tetracycline efflux MFS transporter Tet(38)',
    Scope: 'core',
    'Element type': 'AMR',
    'Element subtype': 'AMR',
    Class: 'TETRACYCLINE',
    Subclass: 'TETRACYCLINE',
    Method: 'EXACTX',
    'Target length': '450',
    'Reference sequence length': '450',
    '% Coverage of reference sequence': '100',
    '% Identity to reference sequence': '100',
    'Alignment length': '450',
    'Accession of closest sequence': 'WP_001100293.1',
    'Name of closest sequence': 'tetracycline efflux MFS transporter Tet(38)',
  },
  {
    _id: '60f4f9547b83af5fcaa35698',
    Name: '100.csv',
    'Contig id': 'contig23',
    Start: '9063',
    Stop: '9440',
    Strand: '+',
    'Gene symbol': 'blaI',
    'Sequence name': 'penicillinase repressor BlaI',
    Scope: 'core',
    'Element type': 'AMR',
    'Element subtype': 'AMR',
    Class: 'BETA-LACTAM',
    Subclass: 'BETA-LACTAM',
    Method: 'BLASTX',
    'Target length': '126',
    'Reference sequence length': '126',
    '% Coverage of reference sequence': '100',
    '% Identity to reference sequence': '99.21',
    'Alignment length': '126',
    'Accession of closest sequence': 'WP_001284656.1',
    'Name of closest sequence': 'penicillinase repressor BlaI',
  },
  {
    _id: '60f4f9547b83af5fcaa3569a',
    Name: '100.csv',
    'Contig id': 'contig5',
    Start: '51112',
    Stop: '51528',
    Strand: '-',
    'Gene symbol': 'fosB',
    'Sequence name': 'FosB1/FosB3 family fosfomycin resistance bacillithiol transferase',
    Scope: 'core',
    'Element type': 'AMR',
    'Element subtype': 'AMR',
    Class: 'FOSFOMYCIN',
    Subclass: 'FOSFOMYCIN',
    Method: 'BLASTX',
    'Target length': '139',
    'Reference sequence length': '139',
    '% Coverage of reference sequence': '100',
    '% Identity to reference sequence': '98.56',
    'Alignment length': '139',
    'Accession of closest sequence': 'WP_000920239.1',
    'Name of closest sequence': 'FosB1/FosB3 family fosfomycin resistance bacillithiol transferase',
  },
  {
    _id: '60f4f9547b83af5fcaa35697',
    Name: '100.csv',
    'Contig id': 'contig23',
    Start: '7316',
    Stop: '9070',
    Strand: '+',
    'Gene symbol': 'blaR1',
    'Sequence name': 'beta-lactam sensor/signal transducer BlaR1',
    Scope: 'core',
    'Element type': 'AMR',
    'Element subtype': 'AMR',
    Class: 'BETA-LACTAM',
    Subclass: 'BETA-LACTAM',
    Method: 'BLASTX',
    'Target length': '585',
    'Reference sequence length': '585',
    '% Coverage of reference sequence': '100',
    '% Identity to reference sequence': '95.56',
    'Alignment length': '585',
    'Accession of closest sequence': 'WP_001096386.1',
    'Name of closest sequence': 'beta-lactam sensor/signal transducer BlaR1',
  },
];

export default function AmrTable({data}) {
  return (
    <Table
      dataSource={data}
      columns={columns}
      bordered
      size="middle"
      pagination={false}
      scroll={{x: 'calc(700px + 50%)', y: 240}}
      
    />
  );
}

// Class, sub-class, contig start, contig end, length, gene symbol
