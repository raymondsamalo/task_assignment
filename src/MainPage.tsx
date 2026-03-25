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
    <main className="container">
      <img className="logo" src={Logo} alt="wasp" />

      <h2 className="title">Welcome to Wasp!</h2>

      <p className="content">
        This is page <code>MainPage</code> located at route <code>/</code>.
        <br />
        Open <code>src/MainPage.tsx</code> to edit it.
        <h1>Skills</h1>
        <ul>
          {skills.map((skill, index)=>(
              <li key={index}>{skill.name}</li> 
          ))}
        </ul>
        <h1>Developers</h1>
        <ul>
          {developers.map((developer, index)=>(
              <li key={index}>{developer.name}</li> 
          ))}
        </ul>
        <h1>Tasks</h1>
        <ul>
          {tasks.map((task, index)=>(
              <li key={index}>{task.title}</li> 
          ))}
        </ul>
      </p>

      <div className="buttons">
        <a
          className="button button-filled"
          href="https://wasp.sh/docs/tutorial/create"
          target="_blank"
          rel="noreferrer noopener"
        >
        </a>
        <a
          className="button button-outlined"
          href="https://discord.com/invite/rzdnErX"
          target="_blank"
          rel="noreferrer noopener"
        >
          Chat on Discord
        </a>
      </div>
    </main>
  );
}
