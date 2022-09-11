import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import "./ImageUpload.css";
const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const filePickedRef = useRef();
  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickImageHandler = () => {
    filePickedRef.current.click();
  };
  const pickedHandler = (event) => {
    let PickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      PickedFile = event.target.files[0];
      setFile(PickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, PickedFile, fileIsValid);
  };
  return (
    <div className="form-control">
      <input
        ref={filePickedRef}
        type="file"
        id={props.id}
        style={{ display: "none" }}
        accept=".jpg,.png,.jepg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview ">
          {previewUrl && <img src={previewUrl} alt="preview" />}

          {!previewUrl && <p>please pick an image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
