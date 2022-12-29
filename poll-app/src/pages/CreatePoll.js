import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { useFormik } from "formik";

import { setUserId, setUserType } from "../store/slices/user/userSlice";
import baseUrl from "../utils/baseUrl";

const validate = (values) => {
	let errors = {};
	if (!values.question) errors.question = "Question is Required!";
	return errors;
};

function CreatePoll() {
	const socket = useRef();
	const dispatch = useDispatch();

	const [wating, setWating] = useState(false);
	const [result, setResult] = useState(null);
	const userId = useSelector((state) => state.user.userId);

	const formik = useFormik({
		initialValues: {
			question: "",
			options: [
				{
					value: "",
					isCorrect: false,
				},
			],
		},
		validate,
		onSubmit: (values) => {
			console.log(values);
			if (values.options.length > 0) {
				setWating(true);
				socket.current.emit("startPoll", {
					poll: { ...values, author: userId },
				});
			}
		},
	});

	useEffect(() => {
		if (!socket.current) socket.current = io(baseUrl);
		if (socket.current) {
			socket.current.emit("join");
			socket.current.on("setUserId", ({ userId }) => {
				dispatch(setUserId(userId));
				dispatch(setUserType("student"));
			});
			socket.current.on("showResult", ({ result }) => {
				console.log({ result, userId: socket.current.id });
				if (socket.current.id === result.author) {
					setWating(false);
					setResult(result);
				}
			});
		}
		return () => {
			socket.current.disconnect();
			dispatch(setUserId(null));
			dispatch(setUserType(""));
		};
	}, []);

	return (
		<section className='vh-100'>
			{wating ? (
				<div className='p-4'>Wating for result...</div>
			) : result ? (
				<div className='row p-4'>
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
			) : (
				<div className='p-4'>
					<h5 className='text-center pb-3'>
						Enter Question and Options
					</h5>
					<div className='row mt-3'>
						<div className='col-2'></div>
						<div className='col-8'>
							<div className='form-group'>
								<input
									type={`text`}
									placeholder='Enter Question'
									className='form-control p-2'
									name='question'
									value={formik.values.question}
									onChange={formik.handleChange}
								/>
								<span
									className='text-danger'
									style={{ fontSize: "0.8rem" }}>
									{formik.errors.question &&
										formik.errors.question}
								</span>
							</div>
						</div>
						<div className='col-2'></div>
					</div>
					<div className='row  mt-3'>
						<div className='col-2'></div>
						<div className='col-5'>Option</div>
						<div className='col-3'>Is Correct?</div>
						<div className='col-3'></div>
					</div>
					<div className='row'>
						<div className='col-2'></div>
						<div className='col-7'>
							{formik.values.options?.map((opt, index) => (
								<div className='row my-2' key={index}>
									<div className='col-8'>
										<input
											className='form-control'
											placeholder='Enter Option'
											name={`options[${index}].value`}
											value={opt.value}
											onChange={formik.handleChange}
										/>
									</div>
									<div className='col-2 text-center'>
										<input
											type='checkbox'
											name={`options[${index}].isCorrect`}
											value={opt.isCorrect}
											checked={opt.isCorrect}
											onChange={(e) => {
												formik.setFieldValue(
													"options",
													formik.values.options.map(
														(k) => ({
															value: k.value,
															isCorrect: false,
														})
													)
												);
												formik.handleChange(e);
											}}
										/>
									</div>
									<div className='col-2 text-center'>
										<button
											className='btn btn-sm btn-outline-danger'
											onClick={() =>
												formik.setValues((prev) => ({
													...prev,
													options: [
														...prev.options.slice(
															0,
															index
														),
														...prev.options.slice(
															index + 1
														),
													],
												}))
											}>
											Remove Option
										</button>
									</div>
								</div>
							))}
						</div>
						<div className='col-3'></div>
					</div>
					<div className='row mt-5'>
						<div className='col-6 text-center'>
							<button
								className='btn btn-outline-primary'
								onClick={() =>
									formik.setValues((prev) => ({
										...prev,
										options: [
											...prev.options,
											{
												value: "",
												isCorrect: false,
											},
										],
									}))
								}>
								Add Another Option
							</button>
						</div>
						<div className='col-6 text-center'>
							<button
								className='btn btn-outline-success'
								onClick={formik.handleSubmit}>
								Start Poll
							</button>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}

export default CreatePoll;
