import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { URL } from "../../../utils/constants";
import { useHistory } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "./StoryReport.css";

function StoryReport(props) {
	const { id } = props.match.params;
	const history = useHistory();
	const [report, setReport] = useState({});
	useEffect(() => {
		fetch(`${URL}/api/report/${id}`).then((response) => {
			if (response.ok) {
				response.json().then((json) => {
					setReport(json);
				});
			} else {
				//        history.replace("/error");
			}
		});
	}, [id, history]);
	const data = {
		labels: report.data ? report.data.map((d) => d[0]) : [],
		datasets: [
			{
				label: "Purchases",
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(75,192,192,0.4)",
				borderColor: "rgba(75,192,192,1)",
				borderCapStyle: "butt",
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: "miter",
				pointBorderColor: "rgba(75,192,192,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: report.data ? report.data.map((d) => d[1].purchase) : [],
			},
			{
				label: "Listenings",
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(200,200,5,0.4)",
				borderColor: "rgba(200,200,5,1)",
				borderCapStyle: "butt",
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: "miter",
				pointBorderColor: "rgba(200,200,5,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(220,220,5,1)",
				pointHoverBorderColor: "rgba(220,220,5, 1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: report.data ? report.data.map((d) => d[1].readings) : [],
			},
			{
				label: "Unique Listenings",
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(240,70,5,0.4)",
				borderColor: "rgba(240,70,5,1)",
				borderCapStyle: "butt",
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: "miter",
				pointBorderColor: "rgba(240,70,5,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(240,70,5,1)",
				pointHoverBorderColor: "rgba(240,70,5, 1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: report.data ? report.data.map((d) => d[1].unique_readings) : [],
			},
		],
	};
	return (
		<>
			<Navbar
				links={[
					{ link: "/viewer", text: "All Stories" },
					{ link: "/account", text: "Account" },
				]}
			/>
			<h1>{report.title}</h1>
			<h4>All Time Downloads: {report.lifetime_purchases}</h4>
			<div className="chart">
				<Line data={data} />
			</div>
		</>
	);
}
export default StoryReport;
