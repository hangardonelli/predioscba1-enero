import React, { useState, useRef } from "react";
import { Form } from "react-bootstrap";
import api from '../api';

const UploadImage = ({name, handleImage, placeholder}) => {
  const [url, setUrl] = useState('placeholder.png');
  const hiddenFieldInput = useRef(null);
  const [objectFormData, setObjectFormData] = useState(null);

  const handleFieldClick = event => {
    hiddenFieldInput.current.click();
  };

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    setUrl(file.name);

    let formData = new FormData();
    formData.append('folder', name); // Path folder.
    formData.append('file', file); // Object File.
    
    // Send formData object.
    setObjectFormData(formData)
    handleImage(formData, file.name);
    // const response = await api.predio.addImage(formData, { headers: {
    //   'Content-Type': 'multipart/form-data'
    // }});
    // console.log(response);
  };

  return (
    <Form.Group>
      {!objectFormData ? (
        <div className="input-group col-xs-12">
          <input
            type="file"
            name="file"
            className="file-upload-default"
            ref={hiddenFieldInput}
            onChange={e => onFileChange(e, name)}
            style={{ display: "none" }}
          />
          <Form.Control
            type="text"
            className="form-control file-upload-info"
            placeholder={`Subir ${name}`}
            onClick={handleFieldClick}
          />
        </div>
      ) : (
        <div className="input-group col-xs-12">
          {`${placeholder} fue cargado.`}
        </div>
      )}
    </Form.Group>
  );
};

export default UploadImage;
