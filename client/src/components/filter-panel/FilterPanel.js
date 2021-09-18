import React, {useState, useEffect, useRef} from 'react';
import {Checkbox, Input, Button, Tree, Col, Row} from 'antd';
import {select} from 'd3';
const {Search} = Input;

export default function FilterPanel (props) {
  const {
    networkData,
    deleteAntibiotic,
    restoreAntibiotic,
    selectMst,
    restorePoint,
  } = props;
  const [data, setData] = useState ([]);
  const [dataList, setDataList] = useState ([]);
  const [restoreData, setRestoreData] = useState ([]);

  useEffect (
    () => {
      let dataTemp = [];
      let dataListTemp = [];
      let restoreDataTemp = [];

      if (networkData !== null) {
        let listAntibiotics = networkData
          .map (a => a.subclasses)
          .flat (1)
          .filter ((v, i, a) => a.indexOf (v) === i)
          .sort ();

        let listRestoreAntibiotics = restorePoint
          .map (a => a.subclasses)
          .flat (1)
          .filter ((v, i, a) => a.indexOf (v) === i)
          .sort ();

        for (let i = 0; i < listAntibiotics.length; i++) {
          dataTemp.push ({
            title: listAntibiotics[i],
            key: listAntibiotics[i],
            children: [],
          });

          dataListTemp.push ({
            title: listAntibiotics[i],
            key: listAntibiotics[i],
          });
        }

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
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState([]);

  const timer = useRef(null);

  const onKeyUp = (e) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => triggerSearch(e), 500);
  };

  const onKeyDown = (e) => {
    clearTimeout(timer);
  };

  const triggerSearch = e => {
    let {value} = e.target;
    if (value !== '') {
      value = value.toUpperCase ();
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
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };

  const handleDeleteSelected = (value) => {
    let antibioticToDelete = checkedKeys;
    let filtered = data.filter(function (item) {
      return antibioticToDelete.indexOf(item.key) <= -1;
    });

    let newNetworkData = JSON.parse(JSON.stringify(networkData));

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

  const handleRestore = (value) => {
    let dataTemp2 = JSON.parse(JSON.stringify(restoreData));
    let newNetworkData = JSON.parse(JSON.stringify(restorePoint));
    restoreAntibiotic(newNetworkData);
    setData(dataTemp2);
  };

  const handleCheckbox = value => {
    selectMst (value);
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
      {/* <Row align="center"> */}
        <Search
          style={{marginBottom: 8}}
          placeholder="Search"
          // onChange={onChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
        />
        <Tree
          checkable
          style={{overflow: 'auto', height: '32vh', marginBottom: 20}}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          selectedKeys={selectedKeys}
          treeData={loop (data)}
        />

      {/* </Row> */}

      <Row align="center">
        <Col>
          <Button
            onClick={e => {
              e.stopPropagation ();
              handleRestore ();
            }}
            style={{marginRight: 30}}
            type="primary"
          >
            Restore
          </Button>
        </Col>
        <Col>
          <Button
            onClick={e => {
              e.stopPropagation ();
              handleDeleteSelected ();
            }}
            type="primary"
          >
            Delete
          </Button>
        </Col>

      </Row>
      <Row align="center">
        <Checkbox
          onChange={e => {
            e.stopPropagation ();
            handleCheckbox (e.target.checked);
          }}
          style={{marginTop: 20}}
        >
          Minimum Spanning Tree
        </Checkbox>
      </Row>

    </div>
  );
}
