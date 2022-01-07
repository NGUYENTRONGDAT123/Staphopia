import React, {useState, useEffect} from 'react';
import {Spin, Image, Typography, Tooltip} from 'antd';
import './AntibioticInfoPanel.css';
const {Link} = Typography;

export default function AntibioticInfoPanel (props) {
  const {antibioticData, isLoading} = props;

  const [name, setName] = useState (null);
  const [formula, setFormula] = useState (null);
  const [weight, setWeight] = useState (null);
  const [image, setImage] = useState (null);
  const [link, setLink] = useState (null);
  const [description, setDescription] = useState (null);

  useEffect (
    () => {
      setName (antibioticData[0].Subclass);
      setFormula (antibioticData[0].Formula);
      setWeight (antibioticData[0].Weight);
      setImage (antibioticData[0].Image);
      setLink (antibioticData[0].Link);
      setDescription (antibioticData[0].Description);
    },
    [antibioticData]
  );
  
  // display spin when data is loading
  if (isLoading)
    return (
      <div className="d-flex justify-content-center flex-column align-items-center">
        <Spin />
      </div>
    );
  
  // display data when it is loaded
  return (
    <div className="d-flex justify-content-center flex-column align-items-center mh-100">
      <Link href={link} target="_blank">
        <Tooltip title={description}>
          <h3 className="antibiotic" style={{textAlign: 'center'}}>{name}</h3>
        </Tooltip>
      </Link>

      {formula
        ? <div>
            <strong>Formula:</strong> {formula}
          </div>
        : null}

      {weight
        ? <div>
            <strong>Weight:</strong> {weight}
          </div>
        : null}

      <div>
        <Image alt={description} src={`${image}`} width="12vh" height="12vh" />
      </div>
    </div>
  );
}
