import React from 'react';
import { getAppConfig } from '../../../config';
import { IOrder } from '../../store-shared/order/types';
import { IProduct } from '../../store-shared/product/types';
import { SafeUser } from '../../uac-shared/user/types';
import { Index } from 'ts-functional/dist/types';

export const ErrorReport = (props:Index<any>) => <>
    <style>
        {`
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                padding: 5px;
                text-align: left;
            }
            tbody tr:nth-child(odd) {
                background-color: #f2f2f2;
            }
            tbody tr:nth-child(even) {
                background-color: #ffffff;
            }
        `}
    </style>
    <div>
        <h1>Error Report</h1>
        <table>
            <thead>
                <tr>
                    <th>Field</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(props).map((key) => 
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{props[key]}</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
</>;