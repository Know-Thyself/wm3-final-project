import React, { useState } from "react";
import { Button } from "@material-ui/core";
import Modal from "react-bootstrap/Modal";
import AddToQueueRoundedIcon from "@material-ui/icons/AddToQueueRounded";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import "bootstrap/dist/css/bootstrap.min.css";

const UploadVideoModal = ({ addNewVideo }) => {
	const [showModal, setShowModal] = useState(false);
	const [title, setTitle] = useState("");
	const [url, setUrl] = useState("");
	const [titleErrorAlert, setTitleErrorAlert] = useState(false);
	const [emptyUrlAlert, seEmptyUrlAlert] = useState(false);
	const [invalidUrlAlert, setInvalidUrlAlert] = useState(false);

	const cancelButtonHandler = () => {
		setShowModal(false);
		setTitleErrorAlert(false);
		seEmptyUrlAlert(false);
		setTitle("");
		setUrl("");
	};
	const handleShow = () => setShowModal(true);

	const submitNewVideo = (e) => {
		e.preventDefault();
		const regExp =
			/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
		const match = url.match(regExp);
		if (title === "" && showModal) {
			setTitleErrorAlert(true);
		} else if (url === "" && showModal) {
			seEmptyUrlAlert(true);
		} else if (!match) {
			setInvalidUrlAlert(true);
		} else if (title !== "" && url !== "" && match) {
			addNewVideo(title, url);
		}
		const requestBody = { title: title, url: url };
		fetch("/api/videos", {
			method: "POST",
			body: JSON.stringify(requestBody),
			headers: { "Content-Type": "application/json" },
		})
			.then((response) => response.json())
			.then((data) => console.log(data));
		if (title !== "" && url !== "" && match) {
			setTitle("");
			setUrl("");
			setShowModal(false);
		}
	};

	return (
		<>
			<Button
				className="add-button"
				variant="contained"
				color="primary"
				onClick={handleShow}
			>
				Add Video &nbsp;
				<AddToQueueRoundedIcon />
			</Button>
			<Modal
				className="modal"
				show={showModal}
				onHide={cancelButtonHandler}
				backdrop="static"
				keyboard={false}
			>
				<Modal.Header closeButton>
					<Modal.Title>Video Uploader Modal</Modal.Title>
				</Modal.Header>
				<Modal.Body className="modal-fullscreen-lg-down modal-body">
					Please enter a title and a valid url of a YouTube video
					<Alert
						className={titleErrorAlert ? "alert-failure" : "d-none"}
						severity="error"
						onClose={() => setTitleErrorAlert(false)}
					>
						Failure! — Title field should not be empty!
					</Alert>
					<TextField
						className="modal-content modal-text"
						autoFocus
						margin="dense"
						id="title"
						label="Title"
						type="text"
						style={{ color: "red" }}
						fullWidth
						onChange={(e) => {
							setTitleErrorAlert(false);
							setTitle(e.target.value);
						}}
						value={title}
					/>
					<Alert
						className={emptyUrlAlert ? "alert" : "d-none"}
						severity="error"
						onClose={() => seEmptyUrlAlert(false)}
					>
						Failure! — A URL field can not be empty!
					</Alert>
					<Alert
						className={invalidUrlAlert ? "alert" : "d-none"}
						severity="error"
						onClose={() => setInvalidUrlAlert(false)}
					>
						Failure! — Invalid URL!
					</Alert>
					<TextField
						className="modal-content modal-text"
						margin="dense"
						id="url"
						label="URL"
						type="url"
						fullWidth
						onChange={(e) => {
							seEmptyUrlAlert(false);
							setUrl(e.target.value);
						}}
						value={url}
					/>
				</Modal.Body>
				<Modal.Footer>
					<div className="upload-and-cancel-buttons">
						<Button
							type="cancel"
							className="cancel-button"
							variant="contained"
							color="default"
							onClick={cancelButtonHandler}
						>
							Cancel
						</Button>
						<Button
							onClick={submitNewVideo}
							type="submit"
							className="submit-btn"
							variant="contained"
							color="primary"
						>
							Upload
						</Button>
					</div>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default UploadVideoModal;
