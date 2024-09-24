// App.js
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContactPage from './components/Contact';
import SignUpPage from './components/SignUp';
import LoginPage from './components/Login';
import HomePage from './components/Home';
import Layout from './components/Layout';
import NoPage from './components/NoPage';
import Dashboard from './components/dashboard';
import { useAuth } from './components/AuthContext';
import AgendasPage from './components/AgendasPage'; 
import AgendaList from './components/test2.js';
import CurrentElection from './components/CurrentElections';
import UserProfile from './components/ProfilePage'
import TopPart from './components/TopPart'
import CreateAgenda from './components/CreateAgenda';
import UpcomingElection from './components/upcomming'
import ElectionOptions from './components/ElectionOption'
import VoteCountDisplayOne from './components/result.js';
import VoteCountDisplay from './components/VoteCountDsiplat.js'
import ElectionOptionUpcomming from './components/ElectionUpcomming.js';
import NotificationsPage from './components/notifications.js';

function App() {
  const { isAuthenticated } = useAuth();  // Removed logout as it's not used
  const isAdmin = true;  // Assuming this value is based on your authentication logic
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route path="/voting/:id" element={<ElectionOptionUpcomming />} />

          <Route path="signup" element={<SignUpPage />} />
          <Route index element={<HomePage isAdmin={isAdmin} />} />
          <Route path="createagenda" element={<CreateAgenda />} />
          <Route path="res" element={<VoteCountDisplayOne />} />
          <Route path="websockets" element={<VoteCountDisplay/>} />
          <Route path="upcoming" element={<UpcomingElection />} />
           <Route path="login" element={<LoginPage />} />
           <Route path="/notifications" element={<NotificationsPage />} />
          {isAuthenticated ? (
            <>
              <Route path="contact" element={<ContactPage />} />
              <Route path="upcoming" element={<UpcomingElection />} />
              <Route path="top" element={<TopPart />} />
              <Route path="dashboard" element={<Dashboard isAdmin={isAdmin} />} />
              <Route path="agendas" element={<AgendasPage />} />      
              <Route path="/vote/:id" element={<ElectionOptions />} />
              <Route path="current-elections" element={<CurrentElection />} />
              <Route path="profile" element={<UserProfile />} />
              {/* <Route path="results" element={<ElectionResults />} /> */}
              <Route path="results" element={<VoteCountDisplay />} />
              <Route path="/test" element={<AgendaList />} />

              <Route path="/voting/:id" element={<ElectionOptionUpcomming />} />
              <Route path="*" element={<NoPage />} />
              <Route path="login" element={<LoginPage />} />
           <Route path="/notifications" element={<NotificationsPage />} />


            </>
          ) : (
            <>
              <Route path="/voting/:id" element={<ElectionOptionUpcomming />} />

               <Route path="upcomming" element={<UpcomingElection />} />
              <Route path="current-elections" element={<CurrentElection />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="*" element={<NoPage />} />
              <Route path="results" element={<VoteCountDisplay />} />
              <Route path="/test" element={<AgendaList />} />

            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;