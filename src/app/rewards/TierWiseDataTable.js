import React from "react";
import Image from "next/image";
import { Check, CheckCheck, CheckCircle, Diamond } from "lucide-react";

const TierWiseDataTable = () => {
  return (
    <>
      <div className="atithyam-benefits offes-details text-center p-0 mt-5">
        <div className="table-responsive">
          <div className="heading-style-1">
            <h1 className="mb-4 mt-4 text-center global-heading">
              Your Benefits, Tailored to Every Tier
            </h1>
          </div>
          <table className="table table-striped text-center table-hover main-table-border">
            <thead className="thead-dark">
              <tr>
                <th>Benefits</th>
                <th>Aarambh</th>
                <th>Swarna</th>
                <th>Amrit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Points Earning</td>
                <td>6% on total amount spent</td>
                <td>7% on total amount spent</td>
                <td>8% on total amount spent</td>
              </tr>
              <tr>
                <td>Bonus Points on Direct Bookings</td>
                <td>100</td>
                <td>110</td>
                <td>120</td>
              </tr>
              <tr>
                <td>Coin Expiry</td>
                <td>2 years inactivity</td>
                <td>2 years inactivity</td>
                <td>2 years inactivity</td>
              </tr>
              <tr>
                <td>Discount On Rooms</td>
                <td>20%</td>
                <td>25%</td>
                <td>30%</td>
              </tr>
              <tr>
                <td>Best Rate Guarantee</td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Free Wifi</td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Bottled Water</td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Welcome Drink</td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Discount On F&amp;B</td>
                <td>10%</td>
                <td>15%</td>
                <td>20%</td>
              </tr>
              <tr>
                <td>Birthday Anniversary Offer</td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Spa Discount*</td>
                <td>10%</td>
                <td>15%</td>
                <td>20%</td>
              </tr>
              <tr>
                <td>Buffet Breakfast On Paid Booking</td>
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Late Check Out</td>
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Early Check In</td>
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Happy Hours</td>
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>2 Piece Laundry Free</td>
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Rewarding On Banquet And Events</td>
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Flexible Cancellation</td>
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Pay At Hotels</td>
                <td />
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Welcome Amenities</td>
                <td />
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Priority Welcome</td>
                <td />
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>In Room Check Ins</td>
                <td />
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Room Upgrade</td>
                <td />
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>Dedicated Customer Support</td>
                <td />
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>24 Hours Check In/Out</td>
                <td />
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
              <tr>
                <td>2nd Guest Free</td>
                <td />
                <td />
                <td>
                  <CheckCircle size={20} color="#000"></CheckCircle>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
      .atithyam-benefits .main-table-border{
              border: 1px solid #a8894c!important;
        }
        .atithyam-benefits .heading-style-1:after,
        .atithyam-benefits .heading-style-1:before {
          display: none !important;
        }
       .atithyam-benefits .table .thead-dark th, .atithyam-benefits .table-responsive .table td {
    padding: 10px 5px;
    color: #000000
}

.atithyam-benefits .table-responsive .table td i {
    font-size: 24px;
    color: #957b54;
}

.atithyam-benefits .table .thead-dark th {
    color: #ffffff;
    border-color: #ffffff;
    border-right: 1px solid #ffffff
}

.atithyam-benefits .table .thead-dark th:last-child {
    border-right: none
}

.atithyam-benefits .table tbody td {
    color: #ffffff;
    border-color: #eeeeee;
    border-right: 1px solid #eeeeee
}

.atithyam-benefits .table tbody td:last-child {
    border-right: none
}

.atithyam-benefits .table tr:nth-child(even) {
    background-color: #eeeeee;
}

.atithyam-benefits .table-striped tbody tr:nth-of-type(odd) {
    background-color: #ffffff;
}
.atithyam-benefits table thead,
.atithyam-benefits table thead tr,
.atithyam-benefits table thead th {
    background: #a8894c;
    color: #fff;
    border-radius: 0!important;
      }

.atithyam-benefits table thead th {
    border: none;
}

.atithyam-benefits table thead th:first-child {
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
}

.atithyam-benefits table thead th:last-child {
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
}



@media (max-width: 767px) {
  .atithyam-benefits table thead th,
    .atithyam-benefits table tr td {
       font-size: 12px;
      }

      `}</style>
    </>
  );
};

export default TierWiseDataTable;
