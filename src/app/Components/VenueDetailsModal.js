'use client';
import React from 'react';

export default function VenueDetailsModal({ venue, onClose }) {
  if (!venue) return null;

  const tableRows = [
    { label: 'Reception Lobby', value: venue.receptionLobby },
    { label: 'Theater', value: venue.theater },
    { label: 'Classroom', value: venue.classRoom },
    { label: 'Round Table', value: venue.roundTable },
    { label: 'U-shape', value: venue.ushape },
    { label: 'Cluster', value: venue.cluster },
    { label: 'Wedding', value: venue.wedding },
    { label: 'Board Room', value: venue.boardRoom },
    { label: 'Floating', value: venue.floating },
    { label: 'Fishbone Setting', value: venue.fishboneSetting },
    { label: 'Social', value: venue.social },
  ].filter(row => row.value !== undefined && row.value !== null && row.value !== '');

  return (
    <div
      className="modal fade show venue-popup"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{venue.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}>x</button>
          </div>
          <div className="modal-body p-3">
            <p>{venue.text}</p>
            <div className="data-table mt-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, idx) => (
                    <tr key={idx}>
                      <th>{row.label}</th>
                      <td>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .data-table thead th {
          background-color: #b49459;
          color: #fff;
          font-size: 12px;
        }
        .data-table tbody th,
        .data-table td {
          font-size: 12px;
        }
        .venue-popup .btn-close {
          background-color: #000;
          color: #fff;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
