import React, {useState} from 'react';
import {Row, Col, Card, Menu, Input, List, Button} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useSelector, useDispatch} from 'react-redux';
import {selectSample} from '../../redux/actions/visualization';

const SAMPLES = [...Array (100).keys ()].map (i => i + 1);
export default function SearchPanel () {
  const SampleInfo = useSelector (state => state.Visualization.sampleInfo);
  const AMRTable = useSelector (state => state.Visualization.amrTable);
  const SampleSelect = useSelector (
    state => state.Visualization.sampleSelection
  );
  const dispatch = useDispatch ();

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
    console.log (newAvailableList);
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
    </div>
  );
}
