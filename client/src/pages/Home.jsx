import React, { useEffect, useState } from 'react';
import Avatar from '../components/Avatar';
import Header from "../components/Header";
import BasicDetails from '../components/BasicDetails';
import PastExperience from '../components/PastExperience';
import SkillSet from '../components/SkillSet';
import EducationQualifications from '../components/EducationQualifications';
import axios from 'axios';
import { useCookies } from 'react-cookie';

function Home() {

  const [cookies] = useCookies(['name']);
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/profile`, {
          headers: {
            loginToken: cookies.loginToken,
          }
        });
        setData(data.data);
        // console.log(data.data)
      } catch (error) {
        // console.log(error)
      }
    })()
  }, [])

  return (
    !data
      ?
      <div>
        <div className="h-screen bg-white">
          <div className="flex justify-center items-center h-full">
            <img className="h-16 w-16" src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt="" />
          </div>
        </div>
      </div>
      :
      <>
        <Header />
        <div className='max-w-4xl mx-auto'>
          <Avatar photoUrl={data?.photoUrl} />
          <BasicDetails name={data.name} email={data.email} phone={data.phone} gender={data.gender} dob={data.dob} location={data.location} passwordLength={data.passwordLength} />
          <PastExperience pastExperience={data.pastExprience} />
          <SkillSet skills={data.skillSet} />
          <EducationQualifications userEducationQualification={data.educationQualification} />
          <br />
          <br />
          <br />
        </div>
      </>
  )
}

export default Home;
