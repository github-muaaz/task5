import React, {useEffect, useState} from 'react';
import faker from 'faker';
import {CSVLink} from 'react-csv';

const App = () => {
    const [region, setRegion] = useState('ru');
    const [errorRate, setErrorRate] = useState(0);
    const [seed, setSeed] = useState(0);
    const [userData, setUserData] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);

    const regionLocales = {
        tr: 'tr',
        ru: 'ru',
        fr: 'fr',
    };

    const generateData = (seed, pageNumber) => {
        faker.locale = regionLocales[region];
        faker.seed(seed + pageNumber);

        const data = [];
        const pageSize = 20;

        for (let i = 0; i < pageSize; i++) {
            const id = faker.random.uuid();
            const name = faker.name.findName();
            const phone = faker.phone.phoneNumber();
            let address = faker.address;
            address = address.streetAddress() + ', ' + address.state()

            data.push({id, name, address, phone});
        }

        return data;
    };

    const applyErrors = (data, errorRate) => {
        return data.map((record, index) => {
            if (index % errorRate !== 0)
                return record;

            let modifiedRecord = {...record};

            const randomIndex = Math.floor(Math.random() * Object.keys(record).length);
            const randomField = Object.keys(record)[randomIndex];

            const oldValue = modifiedRecord[randomField];
            let newValue;

            const errorType = Math.floor(Math.random() * 3);

            switch (errorType) {
                case 0: // delete char
                    const deleteIndex = Math.floor(Math.random() * oldValue.length);
                    newValue = oldValue.slice(0, deleteIndex) + oldValue.slice(deleteIndex + 1);
                    break;
                case 1: // add random char
                    const addIndex = Math.floor(Math.random() * oldValue.length);
                    const randomChar = faker.random.alphaNumeric();
                    newValue = oldValue.slice(0, addIndex) + randomChar + oldValue.slice(addIndex);

                    break;
                case 2: // swapp char
                    const swapIndex = Math.floor(Math.random() * (oldValue.length - 1));

                    newValue =
                        oldValue.slice(0, swapIndex) +
                        oldValue.charAt(swapIndex + 1) +
                        oldValue.charAt(swapIndex) +
                        oldValue.slice(swapIndex + 2);

                    break;
                default:
                    newValue = oldValue;
            }

            return {...modifiedRecord, [randomField]: newValue};
        });
    };

    useEffect(() => {
        const newData = generateData(seed, pageNumber);
        const modifiedData = applyErrors(newData, errorRate);

        setUserData(prevData => [...prevData, ...modifiedData]);
    }, [region, errorRate, seed, pageNumber]);

    const handleRegionChange = (e) => {
        setRegion(e.target.value);
        setUserData([]);
        setPageNumber(1);
        setErrorRate(0);
        setSeed(0);
    };
    const handleErrorRateChange = (e) => setErrorRate(parseInt(e.target.value));
    const handleSeedChange = (e) => {
        const val = e.target.value;

        if (val)
            setSeed(parseInt(val));
        else
            setSeed(0)
    }
    const handleRandomSeed = () => {
        const randomSeed = Math.floor(Math.random() * 100000);
        setSeed(randomSeed);
    };

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom)
            setPageNumber(pageNumber + 1);
    };

    return (
        <div className="container mt-5">
            <div className="row mb-3 align-items-end">
                <div className="col">
                    <label className="form-label">Select Region:</label>
                    <select className="form-select" value={region} onChange={handleRegionChange}>
                        <option value="ru">Russia</option>
                        <option value="tr">Turkey</option>
                        <option value="fr">France</option>
                    </select>
                </div>
                <div className="col">
                    <label className="form-label">Error Rate (0-10):</label>
                    <div className="row align-items-center">
                        <div className="col">
                            <input
                                type="range"
                                className="form-range"
                                min="0" max="10"
                                value={errorRate}
                                onChange={handleErrorRateChange}
                            />
                        </div>
                        <div className="col">
                            <input
                                type="number"
                                className="form-control"
                                min="0"
                                max="10"
                                value={errorRate}
                                onChange={e => setErrorRate(Math.min(parseInt(e.target.value), 10))}
                            />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <label className="form-label">Seed:</label>
                    <div className="input-group">
                        <input type="text" className="form-control" value={seed} onChange={handleSeedChange}/>
                        <button className="btn btn-outline-secondary" type="button" onClick={handleRandomSeed}>Random
                        </button>
                    </div>
                </div>
                <div className="col">
                    <div className="row justify-content-end">
                        <div className="col-6 ">
                            <CSVLink data={userData} filename={`user_data_page_${pageNumber}.csv`} className="btn btn-primary mt-3">
                                Export to CSV
                            </CSVLink>
                        </div>
                    </div>
                </div>
            </div>

            <div className="table-responsive" onScroll={handleScroll} style={{maxHeight: '75vh', overflowY: 'auto'}}>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Index</th>
                        <th>Random Identifier</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Phone</th>
                    </tr>
                    </thead>
                    <tbody>
                    {userData.map((user, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.address}</td>
                            <td>{user.phone}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default App;
