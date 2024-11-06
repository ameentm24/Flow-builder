import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./styles.css";
const Dashboard = () => {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const titleRef = useRef();

  const { userid } = useParams();
  localStorage.setItem("userId", userid);

  const getData = () => {
    const storedData = JSON.parse(localStorage.getItem("flows")) || [];
    const userFlows = storedData.filter((flow) => flow.userId === userid);
    setData(userFlows);
    console.log("Flows for user", userFlows);
  };

  const postFlow = () => {
    const newFlow = {
      _id: new Date().toISOString(),
      flowName: title,
      userId: userid,
    };

    const storedData = JSON.parse(localStorage.getItem("flows")) || [];
    const updatedData = [...storedData, newFlow];
    localStorage.setItem("flows", JSON.stringify(updatedData));

    setData(updatedData.filter((flow) => flow.userId === userid));
    setTitle("");
  };

  const onHandleSubmit = (e) => {
    e.preventDefault();

    if (title.trim() === "") {
      alert("Please enter a flow name.");
      return;
    }

    postFlow();
  };

  const onHandleLogout = () => {
    localStorage.removeItem("userId");

    navigate("/");
  };

  const clickDeleteFlow = (flowId) => {
    const updatedData = data.filter((flow) => flow._id !== flowId);
    const allFlows = JSON.parse(localStorage.getItem("flows")) || [];
    const remainingFlows = allFlows.filter((flow) => flow._id !== flowId);
    localStorage.setItem("flows", JSON.stringify(remainingFlows));
    setData(updatedData);
  };

  useEffect(() => {
    getData();
  }, [userid]);

  return (
    <>
    <div className="topbar-dash">
     <button className="logout-btn" onClick={onHandleLogout}>
        Logout
      </button>
      </div>

    <div className="dashboard-container">
      <form className="flow-create-form" onSubmit={onHandleSubmit}>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder="Enter Flow Name"
          ref={titleRef}
        />
        <button type="submit">Create Flow</button>
      </form>

     

      {data?.length > 0 ? (
        data.map((item) => (
          <div key={item._id} className="flow-item">
            <article onClick={() => navigate(`/user/flow/${item._id}`)}>
              <h2>{item.flowName}</h2>
            </article>
            <button onClick={() => clickDeleteFlow(item._id)}>DELETE</button>
          </div>
        ))
      ) : (
        <p className="no-flows-message">No flows available for this user.</p>
      )}
    </div>
    </>
  );
};

export default Dashboard;
