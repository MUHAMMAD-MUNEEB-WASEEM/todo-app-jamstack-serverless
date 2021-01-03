import React from 'react';

export function Todo({ task, status}) {
    return <div className="card">
        <p className="task"><b>{task}</b></p>
        <p className="id"><b>{status}</b></p>
    </div>
}