import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
	const navigate = useNavigate();
	const [askName, setAskName] = useState(false);
	const [name, setName] = useState("");

	const changePath = () => {
		navigate("/poll", {
			state: { name },
		});
	};

	return (
		<section className='vh-100'>
			<div className='d-flex justify-content-center align-items-center h-100 flex-column'>
				<div className='heading'>
					<h3>
						{askName
							? `Enter your name`
							: `Select what type of user you are?`}
					</h3>
				</div>
				<div className='buttons'>
					{askName ? (
						<div className='form-group text-center'>
							<input
								placeholder='Name'
								type='text'
								value={name}
								onChange={(e) => setName(e.target.value)}
								className='form-control'
							/>
							<button
								onClick={changePath}
								disabled={!name}
								className='btn btn-outline-success m-2 '>
								Proceed
							</button>
						</div>
					) : (
						<>
							<button
								onClick={() => setAskName(true)}
								className='btn btn-outline-success m-2'>
								Student
							</button>
							<Link
								to={`/create-poll`}
								className='btn btn-outline-success m-2'>
								Teacher
							</Link>
						</>
					)}
				</div>
			</div>
		</section>
	);
}

export default Home;
