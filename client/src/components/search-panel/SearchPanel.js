import React, {useState, useEffect} from 'react';
import {Row, Col, Card, Menu, Input, List, Button, Tree} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useSelector, useDispatch} from 'react-redux';
import {selectSample} from '../../redux/actions/visualization';
const {Search} = Input;

const SAMPLES = [...Array (100).keys ()].map (i => i + 1);
export default function SearchPanel () {
  const SampleInfo = useSelector (state => state.Visualization.sampleInfo);
  const PackedCircleData = useSelector (
    state => state.Visualization.packedCircleData
  );
  const AMRTable = useSelector (state => state.Visualization.amrTable);
  const SampleSelect = useSelector (
    state => state.Visualization.sampleSelection
  );
  const dispatch = useDispatch ();

  const treeData = [
    {
      title: '0-0',
      key: '0-0',
      children: [
        {
          title: '0-0-0',
          key: '0-0-0',
          children: [
            {
              title: '0-0-0-0',
              key: '0-0-0-0',
            },
            {
              title: '0-0-0-1',
              key: '0-0-0-1',
            },
            {
              title: '0-0-0-2',
              key: '0-0-0-2',
            },
          ],
        },
        {
          title: '0-0-1',
          key: '0-0-1',
          children: [
            {
              title: '0-0-1-0',
              key: '0-0-1-0',
            },
            {
              title: '0-0-1-1',
              key: '0-0-1-1',
            },
            {
              title: '0-0-1-2',
              key: '0-0-1-2',
            },
          ],
        },
        {
          title: '0-0-2',
          key: '0-0-2',
        },
      ],
    },
    {
      title: '0-1',
      key: '0-1',
      children: [
        {
          title: '0-1-0-0',
          key: '0-1-0-0',
        },
        {
          title: '0-1-0-1',
          key: '0-1-0-1',
        },
        {
          title: '0-1-0-2',
          key: '0-1-0-2',
        },
      ],
    },
    {
      title: '0-2',
      key: '0-2',
    },
  ];
  const [data, setData] = useState ([]);
  const [dataList, setDataList] = useState ([]);
  const [restoreData, setRestoreData] = useState ([]);

  useEffect (
    () => {
      console.log ('useEffect called');
      var dataTemp = [];
      var dataListTemp = [];
      var restoreDataTemp = [];
      if (PackedCircleData !== null) {
        for (let i = 0; i < PackedCircleData.length; i++) {
          if (PackedCircleData[i].name !== null) {
            dataTemp.push ({
              title: PackedCircleData[i].name,
              key: PackedCircleData[i].name,
              children: [],
            });

            restoreDataTemp.push ({
              title: PackedCircleData[i].name,
              key: PackedCircleData[i].name,
              children: [],
            });

            dataListTemp.push ({
              title: PackedCircleData[i].name,
              key: PackedCircleData[i].name,
            });
            for (let j = 0; j < PackedCircleData[i].children.length; j++) {
              dataTemp[dataTemp.length - 1].children.push ({
                title: PackedCircleData[i].children[j].name,
                key: PackedCircleData[i].name.concat (
                  PackedCircleData[i].children[j].name
                ),
              });

              restoreDataTemp[restoreDataTemp.length - 1].children.push ({
                title: PackedCircleData[i].children[j].name,
                key: PackedCircleData[i].name.concat (
                  PackedCircleData[i].children[j].name
                ),
              });

              dataListTemp.push ({
                title: PackedCircleData[i].children[j].name,
                key: PackedCircleData[i].name.concat (
                  PackedCircleData[i].children[j].name
                ),
              });
            }
          }
        }
      }
      setDataList (dataListTemp);
      setData (dataTemp);
      setRestoreData (restoreDataTemp);
    },
    [PackedCircleData]
  );

  const [name, setName] = useState ('');
  const [availableSample, setAvailableSample] = useState (SAMPLES);
  const [toAddSample, setToAddSample] = useState ([]);
  const [foundSample, setFoundSample] = useState ([]);

  const [expandedKeys, setExpandedKeys] = useState ([]);
  const [checkedKeys, setCheckedKeys] = useState ([]);
  const [selectedKeys, setSelectedKeys] = useState ([]);
  const [autoExpandParent, setAutoExpandParent] = useState (true);
  const [searchValue, setSearchValue] = useState ([]);

  const onChange = e => {
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
      // this.setState ({
      //   expandedKeys,
      //   searchValue: value,
      //   autoExpandParent: true,
      // });
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
    console.log ('onExpand', expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.

    setExpandedKeys (expandedKeysValue);
    setAutoExpandParent (false);
  };

  const onCheck = checkedKeysValue => {
    console.log ('onCheck', checkedKeysValue);
    setCheckedKeys (checkedKeysValue);
  };

  const onSelect = (selectedKeysValue, info) => {
    console.log ('onSelect', selectedKeysValue);
    setSelectedKeys (selectedKeysValue);
    var matches = selectedKeysValue[0].match(/(\d+)/);

    if (matches) {
      dispatch (selectSample (matches[0]));
    }
  };

  const filter = e => {
    const keyword = e.target.value;
    if (keyword !== '') {
      const results = toAddSample.filter (sample => {
        return sample
          .toString ()
          .toLowerCase ()
          .startsWith (keyword.toLowerCase ());
        // Use the toLowerCase() method to make it case-insensitive
      });
      setFoundSample (results.map (r => Number (r)));
    } else {
      setFoundSample (toAddSample);
      // If the text field is empty, show all samples
    }
    setName (keyword);
  };

  const handleDelete = value => {
    let sampleToDelete = parseInt (value);
    const newAvailableList = availableSample.filter (
      sample => sample !== sampleToDelete
    );
    const newToAddList = toAddSample.concat (sampleToDelete);
    const newFoundList = foundSample.concat (sampleToDelete);
    setAvailableSample (newAvailableList.sort ((a, b) => a - b));
    setToAddSample (newToAddList.sort ((a, b) => a - b));
    setFoundSample (newFoundList.sort ((a, b) => a - b));
  };

  const handleAdd = value => {
    let sampleToDelete = parseInt (value);
    const newToAddList = toAddSample.filter (
      sample => sample !== sampleToDelete
    );
    const newFoundList = foundSample.filter (
      sample => sample !== sampleToDelete
    );
    const newAvailableList = availableSample.concat (sampleToDelete);
    setAvailableSample (newAvailableList.sort ((a, b) => a - b));
    setToAddSample (newToAddList.sort ((a, b) => a - b));
    setFoundSample (newFoundList.sort ((a, b) => a - b));
  };

  const handleClick = value => {
    dispatch (selectSample (value));
    console.log (SampleInfo);
  };

  const handleDeleteSelected = value => {
    let sampleToDelete = checkedKeys;
    console.log (restoreData);
    let dataTemp1 = [...data];

    let removedDataList = dataList.filter (function (item) {
      return sampleToDelete.indexOf (item.key) <= -1;
    });

    console.log (removedDataList);

    for (let i = 0; i < data.length; i++) {
      // for (let j = 0; j < data[i].children.length; j++) {
      //   if (sampleToDelete.includes(data[i].children[j].key)) {

      //   }
      // }
      if (data[i] !== undefined) {
        var filtered = data[i].children.filter (function (item) {
          return sampleToDelete.indexOf (item.key) <= -1;
        });
        dataTemp1[i].children = filtered;
      }
    }

    setData (dataTemp1);
    console.log (restoreData);
  };

  const handleRestore = value => {
    // let dataTemp2 = [...restoreData]
    let dataTemp2 = JSON.parse (JSON.stringify (restoreData));
    setData (dataTemp2);
  };

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
      <Card title={`Sample to Remove`}>
        <List
          dataSource={availableSample}
          style={{overflow: 'auto', height: '30vh'}}
          renderItem={item => (
            <List.Item
              key={item}
              onMouseEnter={() => console.log ('alo')}
              onClick={e => {
                e.stopPropagation ();
                handleClick (item);
              }}
            >
              <List.Item.Meta title={item} />
              <Button
                key={item}
                type="text"
                icon={<DeleteOutlined />}
                onClick={e => {
                  e.stopPropagation ();
                  handleDelete (item);
                }}
              />
            </List.Item>
          )}
        />
      </Card>
      <Card title={`Sample to Add`}>
        <Input
          value={name}
          onChange={filter}
          placeholder="search sample"
          prefix={<EditOutlined />}
        />
        <List
          dataSource={foundSample}
          style={{overflow: 'auto', height: '30vh'}}
          renderItem={item => (
            <List.Item key={item}>
              <List.Item.Meta title={item} />
              <Button
                key={item}
                type="text"
                icon={<EditOutlined />}
                onClick={e => {
                  e.stopPropagation ();
                  handleAdd (item);
                }}
              />
            </List.Item>
          )}
        />
      </Card>

      <Search
        style={{marginBottom: 8}}
        placeholder="Search"
        onChange={onChange}
      />
      <Tree
        checkable
        style={{overflow: 'auto', height: '30vh'}}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={loop (data)}
      />

      <Button
        onClick={e => {
          e.stopPropagation ();
          handleRestore ();
        }}
      >
        Restore
      </Button>
      <Button
        onClick={e => {
          e.stopPropagation ();
          handleDeleteSelected ();
        }}
      >
        Delete Selected
      </Button>

    </div>
  );
}
