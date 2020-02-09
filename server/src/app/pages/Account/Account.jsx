import React, { useEffect, useState } from "react";
import { URL } from "../../../utils/constants";
import { useHistory } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function Account() {
	const history = useHistory();
	const [authorData, setAuthorData] = useState({});
	useEffect(() => {
		fetch(`${URL}/api/current_user/details`).then((response) => {
			if (response.status === 200) {
				response.json().then((json) => {
					console.log(json);
					setAuthorData(json);
				});
			} else {
				//history.push("/login");
			}
		});
	}, [history, setAuthorData]);
	return (
		<>
			<Navbar
				links={[
					{ link: "/viewer", text: "All Stories" },
					{ link: "/account", text: "Account" },
				]}
			/>
			<div className="container">
				<div className="row">
					<div className="col-8">
						<h4 className="my-3">Account Details</h4>
						<div>
							<h6>Name</h6>
							<p>{authorData.name}</p>
						</div>
						<div>
							<h6>Email Address</h6>
							<p>{authorData.email}</p>
						</div>
					</div>
				</div>

				<div className="row py-5">
					<div className="col-8">
						<h4>Payment Summary</h4>
						<table className="table">
							<thead className="thead-light">
								<tr>
									<th scope="col">Month</th>
									<th scope="col">Payment</th>
									<th scope="col">Paid</th>
								</tr>
							</thead>
							<tbody>
								{authorData.payments
									? authorData.payments.map((i) => (
											<tr key={i.month}>
												<td>{i.month}</td>
												<td>{`$${i.payment}`}</td>
												<td>{i.paid ? "Paid" : "Pending"}</td>
											</tr>
									  ))
									: null}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
}

export default Account;
