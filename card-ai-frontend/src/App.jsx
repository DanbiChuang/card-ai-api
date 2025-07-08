import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from './context.jsx';
import Landing from './pages/Landing.jsx';
import Upload from './pages/Upload.jsx';
import CardReview from './pages/CardReview.jsx';
import Profile from './pages/Profile.jsx';
import Letter from './pages/Letter.jsx';
import Success from './pages/Success.jsx';
import OAuth from './pages/OAuth.jsx';
import TestHeic from './pages/TestHeic.jsx';

export default function App() {
  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/card-review" element={<CardReview />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/letter" element={<Letter />} />
          <Route path="/success" element={<Success />} />
          <Route path="/oauth2callback" element={<OAuth />} />
          <Route path="/test-heic" element={<TestHeic />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
