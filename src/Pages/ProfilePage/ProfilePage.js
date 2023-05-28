import React, { useState } from 'react';
// avatar
import Avatar from "@mui/material/Avatar";
import TextField from '@mui/material/TextField';
// autocomplete places
import PlacesAutocomplete, { geocodeByAddress, geocodeByPlaceId, getLatLng, } from 'react-places-autocomplete';
// date range
import DateTimeRangeContainer from 'react-advanced-datetimerange-picker';
import { FormControl } from 'react-bootstrap';
import moment from "moment";
// rich text editor
import { ContentState, convertFromRaw, EditorState } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// alert
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./ProfilePage.css";
// icon
import EditIcon from '@mui/icons-material/Edit';


const ProfilePage = () => {
    // Date Range
    let now = new Date();
    let start = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
    let end = moment(start).add(1, "days").subtract(1, "seconds");
    let ranges = {
        "Today Only": [moment(start), moment(end)],
        "Yesterday Only": [moment(start).subtract(1, "days"), moment(end).subtract(1, "days")],
        "1 Week": [moment(start), moment(end).add(6, "days")],
        "2 Weeks": [moment(start), moment(end).add(13, "days")],
        "1 Month": [moment(start), moment(end).add(29, "days")],
        "1 Year": [moment(start), moment(end).add(364, "days")],
    }
    let local = {
        "format": "DD-MM-YYYY HH:mm",
        "sundayFirst": false
    }
    let maxDate = moment(start).add(730, "days")

    // Data
    const [avatar, setAvatar] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrw-zJrqRj7j5sHFGj8umsYknIS7ATyfSbwQ&usqp=CAU")
    const [name, setName] = useState("Amir Khan");
    const [address, setAddress] = useState("England");
    const [date, setDate] = useState({
        start: start,
        end: end
    });
    const [description, setDescription] = useState(EditorState.createWithContent(ContentState.createFromText('Enter Description Here!')));


    // Update Profile Image
    const updateProfileImageChange = (e) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatar(reader.result);
            }
        };

        reader.readAsDataURL(e.target.files[0]);
    };

    // Update Address
    const handleSelect = (address) => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => console.log('Success', latLng))
            .catch(error => console.error('Error', error));
    };

    // Update Date
    const applyCallback = (startDate, endDate) => {
        setDate(
            {
                start: moment(startDate).format("YYYY-MM-DD, h:mm:ss a"),
                end: moment(endDate).format("YYYY-MM-DD, h:mm:ss a")
            }
        )
    }

    // 
    // Submit Data
    const updateProfileSubmit = (e) => {
        e.preventDefault();

        if (avatar === "") toast("Select An Avatar!");
        if (name === "") toast("Enter Name!");
        if (date === "") toast("Select Date!");
        if (address === "") toast("Enter Address!");
        if (description === "") toast("Enter Description!");

        if (avatar !== "" && name !== "" && date !== "" && address !== "" && description !== "") {
            const myForm = new FormData();
            myForm.set("avatar", avatar);
            myForm.set("name", name);
            myForm.set("date", date);
            myForm.set("address", address);

            console.log(avatar)
            console.log(name)
            console.log(date)
            console.log(address)
            console.log(description)
        };
    }

    return (
        <div className='ProfilePage'>
            <div className="Top">
                <h6 className='Heading'>Personal Details</h6>

                <div className="TopLeft">
                    <div className="ProfileImage">
                        <Avatar
                            alt="Profile Image"
                            src={avatar}
                            sx={{ width: 120, height: 120 }}
                        />
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={updateProfileImageChange}
                            multiple={false}
                        />
                    </div>
                    <h4>{name}</h4>
                </div>

                <div className="TopRight">
                    <div className="UserAddress">
                        <PlacesAutocomplete
                            value={address}
                            onChange={setAddress}
                            onSelect={handleSelect}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <TextField
                                        fullWidth
                                        id="standard-helperText"
                                        label="Address"
                                        onChange={(e) => setName(e.target.value)}
                                        variant="standard"
                                        size='large'
                                        InputLabelProps={
                                            {
                                                shrink: true,
                                                className: "Label"
                                            }
                                        }
                                        inputMode="search"
                                        {...getInputProps({
                                            className: 'location-search-input',
                                        })}
                                    />

                                    <div className="autocomplete-dropdown-container">
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                                ? 'suggestion-item--active'
                                                : 'suggestion-item';
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>
                    </div>
                </div>
            </div>

            <div className="Center">
                <h6 className='Heading'>Date</h6>
                <DateTimeRangeContainer
                    ranges={ranges}
                    start={start}
                    end={end}
                    local={local}
                    maxDate={maxDate}
                    applyCallback={applyCallback}
                    onChange={applyCallback}
                >
                    <FormControl
                        id="formControlsTextB"
                        type="date"
                        onClick={(e) => { e.preventDefault() }}
                        value={moment(date.start).format('YYYY-MM-DD')}
                    />
                </DateTimeRangeContainer>
            </div>

            <div className="Bottom">
                <h6 className='Heading'>Description</h6>

                <Editor
                    editorState={description}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={(editorState) => { setDescription(editorState); console.log(description.getCurrentContent()) }}
                    toolbar={{
                        options: ['inline', 'list', 'textAlign', 'history']
                    }}
                />

            </div>

            <button
                className='SubmitButton'
                onClick={updateProfileSubmit}
            >
                Submit
            </button>

            <ToastContainer />
        </div>
    )
}

export default ProfilePage