import Logo from "./assets/logo.svg";
import "./Main.css";
import { getTasks, getDevelopers, getSkills } from 'wasp/client/operations'

// TypeScript automatically infers the return values and type-checks
// the payloads.
const tasks = await getTasks()
const developers = await getDevelopers()
const skills = await getSkills()
export function MainPage() {

  return (
    <div>
      <h1 className="title">Welcome to Wasp!</h1>
        <h2>Skills</h2>
        <ul>
          {skills.map((skill, index)=>(
              <li key={index}>{skill.name}</li> 
          ))}
        </ul>
        <h2>Developers</h2>
        <ul>
          {developers.map((developer, index)=>(
              <li key={index}>{developer.name}</li> 
          ))}
        </ul>
        <h2>Tasks</h2>
        <ul>
          {tasks.map((task, index)=>(
              <li key={index}>{task.title}</li> 
          ))}
        </ul>
      </div>
  );
}
