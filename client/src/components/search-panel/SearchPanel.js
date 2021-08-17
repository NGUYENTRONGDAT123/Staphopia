import React, { useState, useEffect } from "react";
import { Card, Input, Button, Tree } from "antd";
const { Search } = Input;

export default function SearchPanel(props) {
  const { packedData, selectSample } = props;

  const [data, setData] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [restoreData, setRestoreData] = useState([]);

  useEffect(() => {
    var dataTemp = [];
    var dataListTemp = [];
    var restoreDataTemp = [];
    if (packedData !== null) {
      for (let i = 0; i < packedData.length; i++) {
        if (packedData[i].name !== null) {
          dataTemp.push({
            title: packedData[i].name,
            key: packedData[i].name,
            children: [],
          });

          restoreDataTemp.push({
            title: packedData[i].name,
            key: packedData[i].name,
            children: [],
          });

          dataListTemp.push({
            title: packedData[i].name,
            key: packedData[i].name,
          });
          for (let j = 0; j < packedData[i].children.length; j++) {
            dataTemp[dataTemp.length - 1].children.push({
              title: packedData[i].children[j].name,
              key: packedData[i].name.concat(packedData[i].children[j].name),
            });

            restoreDataTemp[restoreDataTemp.length - 1].children.push({
              title: packedData[i].children[j].name,
              key: packedData[i].name.concat(packedData[i].children[j].name),
            });

            dataListTemp.push({
              title: packedData[i].children[j].name,
              key: packedData[i].name.concat(packedData[i].children[j].name),
            });
          }
        }
      }
    }
    setDataList(dataListTemp);
    setData(dataTemp);
    setRestoreData(restoreDataTemp);
  }, [packedData]);

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState([]);

  const onChange = (e) => {
    const { value } = e.target;
    if (value !== "") {
      const expandedKeys = dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, data);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);

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

  const onExpand = (expandedKeysValue) => {
    console.log("onExpand", expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.

    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    console.log("onCheck", checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue, info) => {
    console.log("onSelect", selectedKeysValue);
    setSelectedKeys(selectedKeysValue);
    var matches = selectedKeysValue[0].match(/(\d+)/);

    if (matches) {
      selectSample(matches[0]);
    }
  };

  const handleDeleteSelected = (value) => {
    let sampleToDelete = checkedKeys;
    console.log(restoreData);
    let dataTemp1 = [...data];

    let removedDataList = dataList.filter(function (item) {
      return sampleToDelete.indexOf(item.key) <= -1;
    });

    console.log(removedDataList);

    for (let i = 0; i < data.length; i++) {
      // for (let j = 0; j < data[i].children.length; j++) {
      //   if (sampleToDelete.includes(data[i].children[j].key)) {

      //   }
      // }
      if (data[i] !== undefined) {
        var filtered = data[i].children.filter(function (item) {
          return sampleToDelete.indexOf(item.key) <= -1;
        });
        dataTemp1[i].children = filtered;
      }
    }

    setData(dataTemp1);
    console.log(restoreData);
  };

  const handleRestore = (value) => {
    // let dataTemp2 = [...restoreData]
    let dataTemp2 = JSON.parse(JSON.stringify(restoreData));
    setData(dataTemp2);
  };

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
      <Card title="Search Sample">
        <Search
          style={{ marginBottom: 8 }}
          placeholder="Search"
          onChange={onChange}
        />
        <Tree
          checkable
          style={{ overflow: "auto", height: "45vh" }}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          treeData={loop(data)}
        />

        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleRestore();
          }}
        >
          Restore
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteSelected();
          }}
        >
          Delete Selected
        </Button>
      </Card>
    </div>
  );
}
