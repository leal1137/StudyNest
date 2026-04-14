import React from 'react';
import '../App.css';

export function SubjectSelector() {
    return (
        <div className="subject-selector">
            <label>Subjects</label>
            <select className='selector'>
                <option>Everything</option>
                <option>Math</option>
                <option>English</option>
                <option>Economics</option>
                <option>Misc</option>
            </select>
            <button type="button" className="add-subject">
              + Add more subjects
            </button>
        </div>
    )
}
