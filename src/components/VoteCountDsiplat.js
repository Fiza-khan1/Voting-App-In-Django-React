import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import './CssFolder/ResultsPage.css'; // Import your custom CSS

const ResultsPage = () => {
  const [resultsData, setResultsData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:9000/ws/vote-count/');

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket Data Received:", data); 

      if (data.agenda_counts) {
        setResultsData(data.agenda_counts);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    // Clean up the WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <Container fluid className="results-page">
      <header className="bg-primary text-white text-center py-2 headerSummary">
        <h1>Results Overview</h1>
        <p>Summary of voting results</p>
      </header>
      <main className="my-5 text-center">
        <h2 className="mb-4">Elections</h2>
        <Row className="justify-content-center">
          {resultsData.map((agenda) => (
            <Col md={6} lg={4} key={agenda.id} className="mb-4">
              <Card className="agenda-card mx-auto">
                <Card.Body>
                  <Card.Title>{agenda.name}</Card.Title>
                  <Card.Subtitle className="mb-2 mt-2 text-muted small" style={{ color: '#6c757d' , fontSize: '0.8rem'  }}>{agenda.description}</Card.Subtitle>
                  <Card.Text>
                    <strong>Total Votes: </strong>{agenda.vote_count}
                  </Card.Text>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Candidates</th>
                        <th>Vote Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agenda.options.map((option) => (
                        <tr key={option.id}>
                          <td>{option.name}</td>
                          <td>{option.vote_count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </main>
      
    </Container>
  );
};

export default ResultsPage;



// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import Table from 'react-bootstrap/Table'; // Import Bootstrap Table component
// import './CssFolder/votedisplay.css'; // Import custom CSS

// function VoteCountDisplay() {
//   const [optionVoteCounts, setOptionVoteCounts] = useState([]);
//   const [agendaVoteCounts, setAgendaVoteCounts] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let socket;

//     const connectWebSocket = () => {
//       socket = new WebSocket('ws://127.0.0.1:9000/ws/vote-count/');

//       socket.onopen = () => {
//         console.log("WebSocket connection opened");
//       };

//       socket.onmessage = (e) => {
//         try {
//           const data = JSON.parse(e.data);
//           console.log('Received WebSocket data:', data);

//           if (Array.isArray(data.option_counts) && Array.isArray(data.agenda_counts)) {
//             setOptionVoteCounts(data.option_counts);
//             setAgendaVoteCounts(data.agenda_counts);
//           } else {
//             console.error('Unexpected data structure:', data);
//             setError('Received unexpected data structure.');
//           }
//         } catch (error) {
//           console.error('Error parsing WebSocket message:', error);
//           setError('Error parsing WebSocket message.');
//         }
//       };

//       socket.onerror = (e) => {
//         console.error('WebSocket error:', e);
//         setError('WebSocket error: ' + e.message);
//       };

//       socket.onclose = (e) => {
//         console.log('WebSocket closed. Reconnecting...');
//         setTimeout(connectWebSocket, 1000);
//       };
//     };

//     connectWebSocket();

//     return () => {
//       if (socket) socket.close();
//     };
//   }, []);

//   // Function to group options by agenda title
//   const groupByAgenda = (options) => {
//     return options.reduce((acc, option) => {
//       const { agenda__name, name, vote_count } = option;
//       if (!acc[agenda__name]) {
//         acc[agenda__name] = [];
//       }
//       acc[agenda__name].push({ name, vote_count });
//       return acc;
//     }, {});
//   };

//   const groupedOptions = groupByAgenda(optionVoteCounts);

//   return (
//     <div className="container mt-5">
//       <h1 className="mb-4 text-center table-title">Vote Counts</h1>

//       {error && <div className="alert alert-danger alert-custom">{error}</div>}

//       <div className="table-container">
//         <h2 className="mb-3 table-title">Agenda Vote Counts</h2>
//         <Table striped bordered hover className="vote-table">
//           <thead>
//             <tr>
//               <th>Agenda Title</th>
//               <th>Total Votes</th>
//             </tr>
//           </thead>
//           <tbody>
//             {agendaVoteCounts.length > 0 ? (
//               agendaVoteCounts.map((agenda) => (
//                 <tr key={agenda.id}>
//                   <td>{agenda.name || "Agenda Title Missing"}</td>
//                   <td>{agenda.vote_count !== undefined ? agenda.vote_count : "Vote Count Missing"}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="2" className="no-data">No agenda vote counts available.</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>

//         {Object.keys(groupedOptions).length > 0 ? (
//           Object.keys(groupedOptions).map((agendaTitle) => (
//             <div key={agendaTitle} className="mb-5">
//               <h2 className="table-title">{agendaTitle}</h2>
//               <Table striped bordered hover className="vote-table">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Vote Count</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groupedOptions[agendaTitle].map((option, index) => (
//                     <tr key={index}>
//                       <td>{option.name || "Name Missing"}</td>
//                       <td>{option.vote_count !== undefined ? option.vote_count : "Vote Count Missing"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           ))
//         ) : (
//           <p>No option vote counts available.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default VoteCountDisplay;


// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// import Table from 'react-bootstrap/Table'; // Import Bootstrap Table component
// import './CssFolder/votedisplay.css'; // Import custom CSS

// function VoteCountDisplay() {
//   const [optionVoteCounts, setOptionVoteCounts] = useState([]);
//   const [agendaVoteCounts, setAgendaVoteCounts] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let socket;

//     const connectWebSocket = () => {
//       socket = new WebSocket('ws://127.0.0.1:9000/ws/vote-count/');

//       socket.onopen = () => {
//         console.log("WebSocket connection opened");
//       };

//       socket.onmessage = (e) => {
//         try {
//           const data = JSON.parse(e.data);
//           console.log('Received WebSocket data:', data);

//           if (Array.isArray(data.option_counts) && Array.isArray(data.agenda_counts)) {
//             setOptionVoteCounts(data.option_counts);
//             setAgendaVoteCounts(data.agenda_counts);
//           } else {
//             console.error('Unexpected data structure:', data);
//             setError('Received unexpected data structure.');
//           }
//         } catch (error) {
//           console.error('Error parsing WebSocket message:', error);
//           setError('Error parsing WebSocket message.');
//         }
//       };

//       socket.onerror = (e) => {
//         console.error('WebSocket error:', e);
//         setError('WebSocket error: ' + e.message);
//       };

//       socket.onclose = (e) => {
//         console.log('WebSocket closed. Reconnecting...');
//         setTimeout(connectWebSocket, 1000);
//       };
//     };

//     connectWebSocket();

//     return () => {
//       if (socket) socket.close();
//     };
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h1 className="mb-4 text-center table-title">Vote Counts</h1>

//       {error && <div className="alert alert-danger alert-custom">{error}</div>}

//       <div className="table-container">
//         <h2 className="mb-3 table-title">Option Vote Counts</h2>
//         <Table striped bordered hover className="vote-table">
//           <thead>
//             <tr>
//               <th>Option Name</th>
//               <th>Agenda Title</th>
//               <th>Vote Count</th>
//             </tr>
//           </thead>
//           <tbody>
//             {optionVoteCounts.length > 0 ? (
//               optionVoteCounts.map(option => (
//                 <tr key={option.id}>
//                   <td>{option.name || "Option Name Missing"}</td>
//                   <td>{option.agenda__name || "Agenda Title Missing"}</td>
//                   <td>{option.vote_count !== undefined ? option.vote_count : "Vote Count Missing"}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3" className="text-center">No option vote counts available.</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>

//         <h2 className="mb-3 table-title">Agenda Vote Counts</h2>
//         <Table striped bordered hover className="vote-table">
//           <thead>
//             <tr>
//               <th>Agenda Title</th>
//               <th>Total Votes</th>
//               <th>Agenda Description</th>
//             </tr>
//           </thead>
//           <tbody>
//             {agendaVoteCounts.length > 0 ? (
//               agendaVoteCounts.map(agenda => (
//                 <tr key={agenda.id}>
//                   <td>{agenda.name || "Agenda Title Missing"}</td>
//                   <td>{agenda.vote_count !== undefined ? agenda.vote_count : "Vote Count Missing"}</td>
//                   <td>{agenda.description || "Agenda Description Missing"}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3" className="text-center">No agenda vote counts available.</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </div>
//     </div>
//   );
// }

// export default VoteCountDisplay;




// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
// // import './CssFolder/votedisplay.css';
// // Import custom CSS

// function VoteCountDisplay() {
//   const [optionVoteCounts, setOptionVoteCounts] = useState([]);
//   const [agendaVoteCounts, setAgendaVoteCounts] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let socket;

//     const connectWebSocket = () => {
//       socket = new WebSocket('ws://127.0.0.1:9000/ws/vote-count/');

//       socket.onopen = () => {
//         console.log("WebSocket connection opened");
//       };

//       socket.onmessage = (e) => {
//         try {
//           const data = JSON.parse(e.data);
//           console.log('Received WebSocket data:', data);

//           if (Array.isArray(data.option_counts) && Array.isArray(data.agenda_counts)) {
//             setOptionVoteCounts(data.option_counts);
//             setAgendaVoteCounts(data.agenda_counts);
//           } else {
//             console.error('Unexpected data structure:', data);
//             setError('Received unexpected data structure.');
//           }
//         } catch (error) {
//           console.error('Error parsing WebSocket message:', error);
//           setError('Error parsing WebSocket message.');
//         }
//       };

//       socket.onerror = (e) => {
//         console.error('WebSocket error:', e);
//         setError('WebSocket error: ' + e.message);
//       };

//       socket.onclose = (e) => {
//         console.log('WebSocket closed. Reconnecting...');
//         setTimeout(connectWebSocket, 1000);
//       };
//     };

//     connectWebSocket();

//     return () => {
//       if (socket) socket.close();
//     };
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h1 className="mb-4 text-center">Vote Countsss</h1>

//       {error && <div className="alert alert-danger">{error}</div>}

//       <h2 className="mb-3">Option Vote Counts</h2>
// <ul className="list-group mb-4">
//   {optionVoteCounts.length > 0 ? (
//     optionVoteCounts.map(option => (
//       <li key={option.id} className="list-group-item">
//         <strong>Option Name: </strong> {option.name || "Option Name Missing"}<br />
//         <strong>Agenda Title: </strong> {option.agenda__name || "Agenda Title Missing"}<br />
//         <strong>Vote Count: </strong> {option.vote_count !== undefined ? option.vote_count : "Vote Count Missing"}
//       </li>
//     ))
//   ) : (
//     <p>No option vote counts available.</p>
//   )}
// </ul>


//       <h2 className="mb-3">Agenda Counts</h2>
//       <ul className="list-group">
//         {agendaVoteCounts.length > 0 ? (
//           agendaVoteCounts.map(agenda => (
//             <li key={agenda.id} className="list-group-item">
//               <strong>Agenda Title: </strong> {agenda.name || "Agenda Title Missing"}<br />
//               <strong>Total Votes: </strong> {agenda.vote_count !== undefined ? agenda.vote_count : "Vote Count Missing"}<br />
//               <strong>Agenda Description: </strong> {agenda.description || "Agenda Description Missing"}
//             </li>
//           ))
//         ) : (
//           <p>No agenda vote counts available.</p>
//         )}
//       </ul>
//     </div>
//   );
// }

// export default VoteCountDisplay;
