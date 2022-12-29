import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Countdown from "react-countdown";
import io from "socket.io-client";

import {
	setUserId,
	setUserType,
	setUserName,
} from "../store/slices/user/userSlice";
import baseUrl from "../utils/baseUrl";

function Polls() {
	const socket = useRef();
	const dispatch = useDispatch();
	const { state } = useLocation();
	const name = state?.name;

	const [result, setResult] = useState(null);
	const [pollData, setPollData] = useState(null);
	const [delay, setDelay] = useState(null);
	const [selectedOpt, setSelectedOpt] = useState(null);
	const [setSubmitted, setSetSubmitted] = useState(false);
	const userType = useSelector((state) => state.user.userType);

	useEffect(() => {
		if (name) {
			dispatch(setUserName(name));
			dispatch(setUserType("student"));
		}
		if (!socket.current) socket.current = io(baseUrl);
		if (socket.current) {
			socket.current.emit("join");
			socket.current.on("setUserId", ({ userId }) => {
				dispatch(setUserId(userId));
				dispatch(setUserType("student"));
			});
			socket.current.on("newPoll", ({ poll, delay }) => {
				console.log(poll, delay);
				setSetSubmitted(false);
				setResult(null);
				setDelay(delay);
				setPollData(poll);
			});
			socket.current.on("showResult", ({ result }) => {
				console.log({ result, userType });
				// if (userType === "student") {
				setSetSubmitted(false);
				setResult(result);
				// }
			});
		}
		return () => {
			socket.current.disconnect();
			dispatch(setUserId(null));
			dispatch(setUserType(null));
			dispatch(setUserName(""));
		};
	}, []);

	return (
		<div className='d-flex align-items-center justify-content-center vh-100 flex-column'>
			{setSubmitted ? (
				<>Waiting for Result...</>
			) : result ? (
				<div className='row p-4 w-100'>
					<div className='col-12 mt-3 text-center pb-4'>
						<h5>{result.question}</h5>
					</div>
					<div className='col-3'></div>
					<div className='col-6'>
						{result.options?.map((x, index) => (
							<div key={index} className='row'>
								<div className='col-10'>{x.value}</div>
								<div className='col-2'>
									{((x.responses?.length || 0) /
										Number(result.responses)) *
										100}
									%
								</div>
							</div>
						))}
					</div>
					<div className='col-3'></div>
				</div>
			) : pollData ? (
				<>
					<div className='row'>
						<div className='col-12 text-center'>
							<h5>{pollData?.question}</h5>
						</div>
						<div className='col-12 text-center'>
							<Countdown
								precision={2}
								date={Date.now() + Number(delay)}
								renderer={({ hours, minutes, seconds }) => {
									return (
										<p className='d-flex w-100'>
											Answer Before:{" "}
											{`${hours}:${minutes}:${seconds}`}
										</p>
									);
								}}
							/>
						</div>
					</div>
					<div className='row mt-3 p-3'>
						{pollData?.options?.map((opt) => (
							<div className='col-12'>
								<p>
									<input
										disabled={setSubmitted}
										id={opt?.id}
										className='me-1'
										type='checkbox'
										checked={opt?.id === selectedOpt}
										onChange={(e) =>
											setSelectedOpt(opt?.id)
										}
									/>
									<label htmlFor={opt?.id}>
										{opt?.value}
									</label>
								</p>
							</div>
						))}
					</div>
					<div className='row mt-5'>
						<div className='col-3'>
							<button
								className='btn btn-outline-success'
								onClick={(e) => {
									setSetSubmitted(true);
									socket.current.emit("submission", {
										user: {
											userId: socket.current.id,
											name,
										},
										pollId: pollData.id,
										optionId: selectedOpt,
									});
								}}>
								Submit
							</button>
						</div>
					</div>
				</>
			) : (
				<div className=''>
					<h3>Hello {name}!</h3> Waiting for polls...
				</div>
			)}
		</div>
	);
}

export default Polls;
