import React, { useState, useEffect, useRef } from "react";
import { Checkbox, Input, Button, Tree, Col, Row } from "antd";
const { Search } = Input;

export default function FilterPanel(props) {
  const {
    networkData,
    deleteAntibiotic,
    restoreAntibiotic,
    selectMst,
    restorePoint,
  } = props;
  const [data, setData] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [restoreData, setRestoreData] = useState([]);

  useEffect(() => {
    let dataTemp = [];
    let dataListTemp = [];
    let restoreDataTemp = [];

    if (networkData !== null) {
      // create a list to store sample and antibiotic data
      let listAntibiotics = networkData
        .map((a) => a.subclasses)
        .flat(1)
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();
      
      // create a list to restore data
      let listRestoreAntibiotics = restorePoint
        .map((a) => a.subclasses)
        .flat(1)
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();

      // create a flatten list contains antibiotic data for antd components
      for (let i = 0; i < listAntibiotics.length; i++) {
        dataTemp.push({
          title: listAntibiotics[i],
          key: listAntibiotics[i],
          children: [],
        });

        dataListTemp.push({
          title: listAntibiotics[i],
          key: listAntibiotics[i],
        });
      }
      // create a flatten list contains restore data for antd components
      for (let i = 0; i < listRestoreAntibiotics.length; i++) {
        restoreDataTemp.push({
          title: listRestoreAntibiotics[i],
          key: listRestoreAntibiotics[i],
          children: [],
        });
      }
      setDataList(dataListTemp);
      setData(dataTemp);
      setRestoreData(restoreDataTemp);
    }
  }, [networkData, restorePoint]);

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  // eslint-disable-next-line
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState([]);

  // set timer to delay search
  const timer = useRef(null);

  const onKeyUp = (e) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => triggerSearch(e), 500);
  };

  const onKeyDown = (e) => {
    clearTimeout(timer);
  };

  // when the search is triggered
  const triggerSearch = (e) => {
    let { value } = e.target;
    if (value !== "") {
      value = value.toUpperCase();
      // list of expanded keys
      const expandedKeys = dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, data);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      // list of checked keys
      const checkedKeys = dataList
        .map((item) => {
          if (item.key.indexOf(value) > -1) {
            return item.key;
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);

      setExpandedKeys(expandedKeys);
      setCheckedKeys(checkedKeys);
      setSearchValue(value);
      setAutoExpandParent(true);
    } else {
      setExpandedKeys([]);
      setCheckedKeys([]);
      setSearchValue(value);
      setAutoExpandParent(true);
    }
  };

  // get parent key from list
  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  // when expand to see children data
  const onExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  // when select key
  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };

  // delete unwanted sample from visualizations
  const handleDeleteSelected = (value) => {
    let antibioticToDelete = checkedKeys;
    let filtered = data.filter(function (item) {
      return antibioticToDelete.indexOf(item.key) <= -1;
    });

    let newNetworkData = JSON.parse(JSON.stringify(networkData));

    // loop through and delete the selected items
    for (let i = 0; i < newNetworkData.length; i++) {
      newNetworkData[i].subclasses = newNetworkData[i].subclasses.filter(
        function (item) {
          var valid = true;
          for (var i = 0; i < antibioticToDelete.length; i++) {
            if (item.indexOf(antibioticToDelete[i]) > -1) {
              valid = false;
            }
          }

          return valid;
        }
      );
    }

    deleteAntibiotic(newNetworkData);
    setData(filtered);
  };

  // restore the original network data
  const handleRestore = (value) => {
    let dataTemp2 = JSON.parse(JSON.stringify(restoreData));
    let newNetworkData = JSON.parse(JSON.stringify(restorePoint));
    restoreAntibiotic(newNetworkData);
    setData(dataTemp2);
  };

  // check if the minimum spanning tree option is selected
  const handleCheckbox = (value) => {
    selectMst(value);
  };

  // loop through data to create data tree
  const loop = (data) =>
    data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return { title, key: item.key, children: loop(item.children) };
      }

      return {
        title,
        key: item.key,
      };
    });
  return (
    <div>
      <Search
        style={{ marginBottom: 8 }}
        placeholder="Search"
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
      <Tree
        checkable
        style={{ overflow: "auto", height: "32vh", marginBottom: 20 }}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        selectedKeys={selectedKeys}
        treeData={loop(data)}
      />

      <Row align="center">
        <Col>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRestore();
            }}
            style={{ marginRight: 30 }}
            type="primary"
          >
            Restore
          </Button>
        </Col>
        <Col>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSelected();
            }}
            type="primary"
          >
            Delete
          </Button>
        </Col>
      </Row>
      <Row align="center">
        <Checkbox
          onChange={(e) => {
            e.stopPropagation();
            handleCheckbox(e.target.checked);
          }}
          style={{ marginTop: 20 }}
        >
          Minimum Spanning Tree
        </Checkbox>
      </Row>
    </div>
  );
}
