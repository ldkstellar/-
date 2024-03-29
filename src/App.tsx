import { useReducer, useRef } from "react";
import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Edit from "./pages/Edit";
import NEW from "./pages/New";
import Diary from "./pages/Diary";
import RouteTest from "./components/RouteTest";

export interface info {
  id: number;
  date: any;
  content: string;
  emotionId: number;
}

export interface dispatchFunc {
  onCreate: (date: any, content: string, emotionId: number) => void;
  onEdit: (
    targetId: number,
    date: any,
    content: string,
    emotionId: number
  ) => void;
  onRemove: (targetId: number) => void;
}

export const DiaryStateContext = React.createContext<info[]>([]);
export const DiaryDispatchContext = React.createContext<dispatchFunc>({
  onCreate: () => {},
  onEdit: () => {},
  onRemove: () => {},
});

const dummyData: info[] = [
  {
    id: 1,
    emotionId: 1,
    content: "오늘의 일기 1번",
    date: 1709015129674,
  },

  {
    id: 2,
    emotionId: 2,
    content: "오늘의 일기 2번",
    date: 1709015129675,
  },

  {
    id: 3,
    emotionId: 3,
    content: "오늘의 일기 3번",
    date: 1709015129676,
  },

  {
    id: 4,
    emotionId: 4,
    content: "오늘의 일기 4번",
    date: 1709015129677,
  },

  {
    id: 5,
    emotionId: 5,
    content: "오늘의 일기 5번",
    date: 1709015129678,
  },
];

const reducer = (state: info[], action: any) => {
  let newState = [];

  switch (action.type) {
    case "INIT":
      return action.data;

    case "CREATE":
      newState = [action.data, ...state];
      break;

    case "REMOVE":
      newState = state.filter((it) => it.id !== action.targetId);
      break;

    case "EDIT":
      newState = state.map((it) =>
        it.id === action.data.id ? { ...action.data } : it
      );
      break;

    default:
      return state;
  }
  return newState;
};

function App() {
  const [data, dispatch] = useReducer(reducer, dummyData);
  const dataId = useRef(0);

  const onCreate = (date: any, content: string, emotionId: number) => {
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        date: new Date(date).getTime(),
        content,
        emotionId,
      },
    });
    dataId.current += 1;
  };

  const onRemove = (targetId: number) => {
    dispatch({ type: "REMOVE", targetId });
  };

  const onEdit = (
    targetId: number,
    date: any,
    content: string,
    emotionId: number
  ) => {
    dispatch({
      type: "EDIT",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotionId,
      },
    });
  };

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{ onCreate, onEdit, onRemove }}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<NEW />} />
              <Route path="/diary/:id" element={<Diary />} />
              <Route path="/edit/:id" element={<Edit />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}
export default App;

