import React from 'react'
import './Categories.css'
function Categories() {
  return (
    <div>
        <div id="b">
            <h1>Browse by Categories</h1>
            <h3>Explore books across various categories and <br/>
            discover the perfect books for your learning journey.</h3>
        </div>
        <div id="b1">
            <h3>CATEGORIES</h3>
        </div>
        <div id="b2">
            <ul>
                <li>Programming
                    <h3>Explore coding, web development, and software engineering books.</h3>
                    <h3>Number of Books:</h3>
                </li>
                <li>Engineering
                    <h3>Find textbooks and reference materials for various engineering disciplines and technical subjects.</h3>
                    <h3>Number of Books:</h3>
                </li>
                <li>Competitive Exams
                    <h3>Prepare for entrance exams, government jobs, and aptitude tests with specialized study materials.</h3>
                    <h3>Number of Books:</h3>
                </li>
                <li>Literature
                    <h3>Discover novels, poetry, fiction, and classic literary works from renowned authors.</h3>
                    <h3>Number of Books:</h3>
                </li>
                <li>Science
                    <h3>Explore books covering physics, chemistry, biology, and other scientific concepts.</h3>
                    <h3>Number of Books:</h3>
                </li>
                <li>Technology
                    <h3>Stay updated with emerging technologies, artificial intelligence, cybersecurity, and innovation.</h3>
                    <h3>Number of Books:</h3>
                </li>
                <li>General Knowledge
                    <h3>Enhance your awareness with books covering current affairs, history, geography, and world events.</h3>
                    <h3>Number of Books:</h3>
                </li>
                
            </ul>
        </div>
    </div>
  )
}

export default Categories