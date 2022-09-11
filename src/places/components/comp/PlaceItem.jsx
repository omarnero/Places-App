import React, { useContext, useState } from "react";
import Button from "../../../shared/components/FormElements/Button";
import Card from "../../../shared/components/UIElements/Card";
import Modal from "../../../shared/components/UIElements/Modal";
import Map from "../../../shared/components/UIElements/Map";
import "./PlaceItem.css";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { isLogdedIn, userId, token } = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const canceldeleteModal = () => {
    setShowConfirmModal(false);
  };
  const confirmModelShow = () => {
    setShowConfirmModal(true);
  };
  const confirmdeletModal = async () => {
    try {
      sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
    setShowConfirmModal(false);
  };
  const closeMapHandler = () => setShowMap(false);
  const openMapHandler = () => setShowMap(true);
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner />}
      <li className="place-item">
        <Modal
          show={showMap}
          onCancel={closeMapHandler}
          header={props.address}
          contentClass={`place-item__modal-content`}
          footerClass={`place-item__modal-actions`}
          footer={<Button onClick={closeMapHandler}> Close</Button>}
        >
          <div className="map-container">
            <Map center={props.coordinates} zoom={16} />
          </div>
        </Modal>
        <Modal
          show={showConfirmModal}
          header={<h2> Are you sure ?</h2>}
          footerClass={`place-item__modal-actions`}
          footer={
            <>
              <Button inverse onClick={canceldeleteModal}>
                Cancel
              </Button>
              <Button danger onClick={confirmdeletModal}>
                Confirm
              </Button>
            </>
          }
        >
          <p>are you sure want do delete this place </p>
        </Modal>
        <Card className="place-item__content">
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSETS_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {userId === props.creatorId && (
              <Button danger onClick={confirmModelShow}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceItem;
