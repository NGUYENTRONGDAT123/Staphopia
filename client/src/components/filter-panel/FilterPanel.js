import React, {useState, useEffect, useRef} from 'react';
import {Card, Input, Button, Tree} from 'antd';
import {select} from 'd3';
const {Search} = Input;

export default function FilterPanel (props) {
  const {
    networkData,
    deleteAntibiotic,
    restoreAntibiotic,
    restorePoint,
  } = props;
  const [data, setData] = useState ([]);
  const [dataList, setDataList] = useState ([]);
  const [restoreData, setRestoreData] = useState ([]);

  //TODO: Add data
  useEffect (() => {}, [networkData, restorePoint]);

  const [expandedKeys, setExpandedKeys] = useState ([]);
  const [checkedKeys, setCheckedKeys] = useState ([]);
  const [selectedKeys, setSelectedKeys] = useState ([]);
  const [autoExpandParent, setAutoExpandParent] = useState (true);
  const [searchValue, setSearchValue] = useState ([]);

  const timer = useRef (null);

  const onKeyUp = e => {
    clearTimeout (timer.current);
    timer.current = setTimeout (() => triggerSearch (e), 500);
  };

  const onKeyDown = e => {
    clearTimeout (timer);
  };

  const triggerSearch = e => {
    const {value} = e.target;
    if (value !== '') {
      const expandedKeys = dataList
        .map (item => {
          if (item.title.indexOf (value) > -1) {
            return getParentKey (item.key, data);
          }
          return null;
        })
        .filter ((item, i, self) => item && self.indexOf (item) === i);

      const checkedKeys = dataList
        .map (item => {
          if (item.key.indexOf (value) > -1) {
            return item.key;
          }
          return null;
        })
        .filter ((item, i, self) => item && self.indexOf (item) === i);

      setExpandedKeys (expandedKeys);
      setCheckedKeys (checkedKeys);
      setSearchValue (value);
      setAutoExpandParent (true);
    } else {
      setExpandedKeys ([]);
      setCheckedKeys ([]);
      setSearchValue (value);
      setAutoExpandParent (true);
    }
  };

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some (item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey (key, node.children)) {
          parentKey = getParentKey (key, node.children);
        }
      }
    }
    return parentKey;
  };

  const onExpand = expandedKeysValue => {
    //console.log ('onExpand', expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.

    setExpandedKeys (expandedKeysValue);
    setAutoExpandParent (false);
  };

  const onCheck = checkedKeysValue => {
    //console.log ('onCheck', checkedKeysValue);
    setCheckedKeys (checkedKeysValue);
  };



  //TODO
//   const handleDeleteSelected = value => {
//     let sampleToDelete = checkedKeys;
//     let dataTemp = [...data];
//     for (let i = 0; i < data.length; i++) {
//       if (data[i] !== undefined) {
//         var filtered = data[i].children.filter (function (item) {
//           return sampleToDelete.indexOf (item.key) <= -1;
//         });
//         dataTemp[i].children = filtered;
//       }
//     }

//     let newPackedData = formatData (dataTemp);
//     deleteSample (newPackedData);
//     setData (dataTemp);
//     //console.log (restoreData);
//   };



  //TODO
//   const handleRestore = value => {
//     let dataTemp2 = JSON.parse (JSON.stringify (restoreData));
//     let newPackedData = formatData (dataTemp2);
//     restoreSample (newPackedData);
//     setData (dataTemp2);
//   };

  const loop = data =>
    data.map (item => {
      const index = item.title.indexOf (searchValue);
      const beforeStr = item.title.substr (0, index);
      const afterStr = item.title.substr (index + searchValue.length);
      const title = index > -1
        ? <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        : <span>{item.title}</span>;
      if (item.children) {
        return {title, key: item.key, children: loop (item.children)};
      }

      return {
        title,
        key: item.key,
      };
    });
  return (
    <div>
      <Search
        style={{marginBottom: 8}}
        placeholder="Search"
        // onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
      <Tree
        checkable
        style={{overflow: 'auto', height: '72vh'}}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        selectedKeys={selectedKeys}
        treeData={loop (data)}
      />
      <br />
      <Button
        onClick={e => {
          e.stopPropagation ();
        //   handleRestore ();
        }}
      >
        Restore
      </Button>
      <Button
        onClick={e => {
          e.stopPropagation ();
        //   handleDeleteSelected ();
        }}
      >
        Delete Selected
      </Button>
    </div>
  );
}
