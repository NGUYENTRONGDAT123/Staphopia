import React, {useState, useEffect} from 'react';

export default function SampleInfoPanel (props) {
  const {sampleMetadata} = props;

  const [sampleId, setSampleId] = useState (null);
  const [collectionDate, setCollectionDate] = useState (null);
  const [location, setLocation] = useState (null);
  const [experimentTitle, setExperimentTitle] = useState (null);
  const [host, setHost] = useState (null);
  const [isolationSource, setIsolationSource] = useState (null);
  const [strain, setStrain] = useState (null);

  useEffect (
    () => {
      setSampleId (sampleMetadata[0].sample_id);
      setCollectionDate (sampleMetadata[0].collection_date);
      setLocation (sampleMetadata[0].location);
      setExperimentTitle (sampleMetadata[0].experiment_title);
      setHost (sampleMetadata[0].host);
      setIsolationSource (sampleMetadata[0].isolation_source);
      setStrain (sampleMetadata[0].strain);
    },
    [sampleMetadata]
  );

  return(
    <div>
      <div>Sample ID: {sampleId}</div>
      <div>Collection Date: {collectionDate}</div>
      <div>Location: {location}</div>
      <div>Experiment Title: {experimentTitle}</div>
      <div>Host: {host}</div>
      <div>Isolation Source: {isolationSource}</div>
      <div>Strain: {strain}</div>

    </div>
  )
    
}
