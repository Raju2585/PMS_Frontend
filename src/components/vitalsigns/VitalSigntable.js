import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Medicalhistory/VitalSigns.css';
import { Chart, registerables } from 'chart.js';
import 'chartjs-plugin-annotation';

Chart.register(...registerables);

const VitalSignsTable = () => {
  const [patientId] = useState(2);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVitalSigns = async () => {
      try {
        const response = await axios.get(`https://localhost:44376/api/VitalSign/GetVitalSigns?patientId=${patientId}`);
        if (Array.isArray(response.data)) {
          setVitalSigns(response.data);
        } else if (response.data.vitalSignId) {
          setVitalSigns([response.data]);
        } else {
          setError('Unexpected data format');
        }
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchVitalSigns();
  }, [patientId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error}</p>;

  const labels = vitalSigns.map(v => new Date(v.date).toLocaleDateString());

  // Heart Rate Data
  const heartRateData = vitalSigns.map(v => v.heartRate);
  const heartRatePieData = [
    vitalSigns.filter(v => v.heartRate < 60).length,
    vitalSigns.filter(v => v.heartRate >= 60 && v.heartRate <= 100).length,
    vitalSigns.filter(v => v.heartRate > 100).length,
  ];

  const heartRateLineChartData = {
    labels,
    datasets: [
      {
        label: 'Heart Rate',
        data: heartRateData,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const heartRatePieChartData = {
    labels: ['Low', 'Normal', 'High'],
    datasets: [
      {
        data: heartRatePieData,
        backgroundColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
      },
    ],
  };

  // Temperature Data
  const temperatureData = vitalSigns.map(v => v.temperature);
  const temperatureLineChartData = {
    labels,
    datasets: [
      {
        label: 'Temperature',
        data: temperatureData,
        fill: false,
        borderColor: 'rgba(255, 206, 86, 1)',
        tension: 0.1,
      },
    ],
  };

  // Oxygen Saturation Data
  const oxygenSaturationData = vitalSigns.map(v => v.oxygenSaturation);
  const oxygenPieData = [
    vitalSigns.filter(v => v.oxygenSaturation >= 90).length,
    vitalSigns.filter(v => v.oxygenSaturation < 90).length,
  ];

  const oxygenLineChartData = {
    labels,
    datasets: [
      {
        label: 'Oxygen Saturation',
        data: oxygenSaturationData,
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1,
      },
    ],
  };

  const oxygenPieChartData = {
    labels: ['Normal', 'Low'],
    datasets: [
      {
        data: oxygenPieData,
        backgroundColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
      },
    ],
  };

  // Blood Pressure Data
  const systolicData = [];
  const diastolicData = [];

  vitalSigns.forEach(v => {
    if (v.bloodPressure) {
      const [systolic, diastolic] = v.bloodPressure.split('/').map(Number);
      systolicData.push(systolic);
      diastolicData.push(diastolic);
    } else {
      systolicData.push(0);
      diastolicData.push(0);
    }
  });

  const bloodPressureLineChartData = {
    labels,
    datasets: [
      {
        label: 'Systolic Blood Pressure',
        data: systolicData,
        fill: false,
        borderColor: 'rgba(255, 0, 0, 1)', // Red for systolic
        tension: 0.1,
      },
      {
        label: 'Diastolic Blood Pressure',
        data: diastolicData,
        fill: false,
        borderColor: 'rgba(0, 128, 0, 1)', // Green for diastolic
        tension: 0.1,
      },
      {
        label: 'Normal Systolic Range',
        data: Array(labels.length).fill(120), // Normal systolic value
        borderColor: 'rgba(255, 206, 86, 0.5)',
        fill: false,
        borderDash: [5, 5],
      },
      {
        label: 'Normal Diastolic Range',
        data: Array(labels.length).fill(80), // Normal diastolic value
        borderColor: 'rgba(255, 206, 86, 0.5)',
        fill: false,
        borderDash: [5, 5],
      },
    ],
  };


  // Respiratory Rate Data
  const respiratoryRateData = vitalSigns.map(v => v.respiratoryRate);
  const respiratoryLineChartData = {
    labels,
    datasets: [
      {
        label: 'Respiratory Rate',
        data: respiratoryRateData,
        fill: false,
        borderColor: 'rgba(255, 159, 64, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="vital-signs-container mb-4" style={{ width: '80%', margin: '0 auto' }}>
      <h2 className="vital-signs-title mb-4">Vital Signs</h2>

      <div className="row">
        <div className="col-md-4">
          <h3>Heart Rate</h3>
          <div style={{ width: '300px', height: '200px' }}>
            <Line data={heartRateLineChartData} options={{ responsive: true }} />
          </div>
          <div style={{ width: '300px', height: '200px' }}>
            <Pie data={heartRatePieChartData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="col-md-4">
          <h3>Temperature</h3>
          <div style={{ width: '300px', height: '200px' }}>
            <Line data={temperatureLineChartData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="col-md-4">
          <h3>Oxygen Saturation</h3>
          <div style={{ width: '300px', height: '200px' }}>
            <Line data={oxygenLineChartData} options={{ responsive: true }} />
          </div>
          <div style={{ width: '300px', height: '200px' }}>
            <Pie data={oxygenPieChartData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <h3>Blood Pressure</h3>
          <div style={{ width: '300px', height: '200px' }}>
            <Line data={bloodPressureLineChartData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="col-md-4">
          <h3>Respiratory Rate</h3>
          <div style={{ width: '300px', height: '200px' }}>
            <Line data={respiratoryLineChartData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VitalSignsTable;
