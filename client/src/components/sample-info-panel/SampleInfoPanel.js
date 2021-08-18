import React, { useState, useEffect } from "react";
import { Spin } from "antd";

export default function SampleInfoPanel(props) {
  const { sampleMetadata } = props;

  const [sampleId, setSampleId] = useState(null);
  const [collectionDate, setCollectionDate] = useState(null);
  const [location, setLocation] = useState(null);
  const [experimentTitle, setExperimentTitle] = useState(null);
  const [host, setHost] = useState(null);
  const [isolationSource, setIsolationSource] = useState(null);
  const [strain, setStrain] = useState(null);

  useEffect(() => {
    setSampleId(sampleMetadata[0].sample_id);
    setCollectionDate(sampleMetadata[0].collection_date);
    setLocation(sampleMetadata[0].location);
    setExperimentTitle(sampleMetadata[0].experiment_title);
    setHost(sampleMetadata[0].host);
    setIsolationSource(sampleMetadata[0].isolation_source);
    setStrain(sampleMetadata[0].strain);
  }, [sampleMetadata]);

  const MainContent = () => {};

  if (props.isLoading)
    return (
      <div className="d-flex justify-content-center flex-column align-items-center">
        <Spin />
      </div>
    );
  return (
    <div className="d-flex justify-content-center flex-column align-items-center mh-100">
      <h1>{sampleId}</h1>
      {collectionDate ? (
        <div>
          <strong>Collection Date:</strong> {collectionDate}
        </div>
      ) : null}

      <div>
        <strong>Location:</strong> {location}
      </div>
      <div>
        <strong>Experiment Title:</strong> {experimentTitle}
      </div>
      {host ? (
        <div>
          <strong>Host:</strong> {host}
        </div>
      ) : null}
      {isolationSource ? (
        <div>
          <strong>Isolation Source:</strong> {isolationSource}
        </div>
      ) : null}
      {strain ? (
        <div>
          <strong>Strain:</strong> {strain}
        </div>
      ) : null}
    </div>
  );
}
