import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Dropdown from '../common/Dropdown';
import FileInput from '../common/FileInput';
import DropdownWithSearch from '../common/DropdownWithSearch';

const enrollmentTypeOptions = [
    { label: 'New', value: 'new' },
    { label: 'Transferee', value: 'transferee' },
    { label: 'Old/Continuing', value: 'old/continuing' },
];

const CreateEnrollmentForm = ({ onSave, onClose }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [suffix, setSuffix] = useState('');
    const [lrn, setLrn] = useState('');
    const [yearLevelId, setYearLevelId] = useState('');
    const [classArmId, setClassArmId] = useState('');
    const [enrollmentType, setEnrollmentType] = useState('new');
    const [yearLevels, setYearLevels] = useState([]);
    const [classArms, setClassArms] = useState([]);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const clearFields = () => {
        setFirstName('');
        setLastName('');
        setMiddleName('');
        setSuffix('');
        setLrn('');
        setSelectedStudentId(null);
        setProfilePhoto(null);
        setYearLevelId('');
        setClassArmId('');
        setClassArms([]);
    };

    useEffect(() => {
        fetchYearLevels();
    }, []);

    const fetchYearLevels = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/year-level');
            const data = await res.json();
            setYearLevels(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleYearLevelChange = (e) => {
        const selectedId = parseInt(e.target.value, 10);
        setYearLevelId(selectedId);
        const selected = yearLevels.find((yl) => yl.yearLevelId === selectedId);
        setClassArms(selected?.class_arms || []);
        setClassArmId('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('yearLevelId', yearLevelId);
        formData.append('classArmId', classArmId);
        formData.append('enrollmentType', enrollmentType);

        if (enrollmentType === 'old/continuing') {
            if (!selectedStudentId) {
                alert("Please select a student.");
                setIsSubmitting(false);
                return;
            }
            formData.append('studentId', selectedStudentId);
        } else {
            formData.append('lrn', lrn);
            formData.append('firstName', firstName);
            formData.append('middleName', middleName);
            formData.append('lastName', lastName);
            formData.append('suffix', suffix);
            if (profilePhoto) formData.append('profilePhoto', profilePhoto);
        }

        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            console.error('Failed:', err.message);
        } finally {
            setIsSubmitting(false);
        }
    };




    const [students, setStudents] = useState([]);

    useEffect(() => {
        if (enrollmentType === 'old/continuing') {
            fetchStudents();
        }
    }, [enrollmentType]);

    const fetchStudents = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/student');
            const data = await res.json();
            const formatted = data.students.map(s => ({
                label: `${s.firstName} ${s.lastName}`,
                value: s.studentId,
                photo: s.profilePhoto ? `http://localhost:8000/${s.profilePhoto}` : null,
                ...s
            }));
            setStudents(formatted);
        } catch (err) {
            console.error('Failed to load students:', err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <section className="mb-12">
                    <div className="mb-4">
                        <Dropdown
                            label="Enrollment Type"
                            items={enrollmentTypeOptions}
                            selectedItem={enrollmentTypeOptions.find(i => i.value === enrollmentType)}
                            onSelect={(item) => {
                                setEnrollmentType(item.value);
                                clearFields();
                            }}
                        />

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Dropdown
                            label="Year Level"
                            required
                            items={[{ label: 'Select Year Level', value: '' }, ...yearLevels.map(yl => ({
                                label: yl.yearLevelName, value: yl.yearLevelId
                            }))]}
                            selectedItem={yearLevels.map(yl => ({
                                label: yl.yearLevelName, value: yl.yearLevelId
                            })).find(i => i.value === yearLevelId) || { label: 'Select Year Level', value: '' }}
                            onSelect={(item) => handleYearLevelChange({ target: { value: item.value } })}
                        />
                        <Dropdown
                            label="Class"
                            required
                            items={[{ label: 'Select Class', value: '' }, ...classArms.map(ca => ({
                                label: ca.className, value: ca.classArmId
                            }))]}
                            selectedItem={classArms.map(ca => ({
                                label: ca.className, value: ca.classArmId
                            })).find(i => i.value === classArmId) || { label: 'Select Class', value: '' }}
                            onSelect={(item) => setClassArmId(item.value)}
                        />
                    </div>
                </section>

                {(enrollmentType === 'new' || enrollmentType === 'transferee') ? (
                    <section>
                        <div className='mb-4'>
                            <Input
                                label="Learner Reference Number (LRN)"
                                value={lrn}
                                onChange={(e) => setLrn(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <Input
                                label="Middle Name"
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                            <Input
                                label="Suffix"
                                value={suffix}
                                onChange={(e) => setSuffix(e.target.value)}
                            />
                        </div>
                    </section>
                ) : (
                    <section className="mb-4">
                        <DropdownWithSearch
                            label="Select Student"
                            items={students}
                            selectedItem={students.find(s => s.value === selectedStudentId)}
                            onSelect={(student) => {
                                setSelectedStudentId(student.value);
                                setFirstName(student.firstName);
                                setMiddleName(student.middleName);
                                setLastName(student.lastName);
                                setSuffix(student.suffix);
                                setLrn(student.lrn);
                            }}
                            renderItem={(student) => (
                                <div className="flex items-center gap-2">
                                    <img
                                        src={student.photo || '/default-avatar.png'}
                                        alt={`${student.label}'s profile`}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <span>{student.label}</span>
                                </div>
                            )}
                        />
                    </section>
                )}


                {enrollmentType !== 'old/continuing' && (
                    <section>
                        <FileInput
                            label="Upload Image"
                            accept="image/*"
                            onChange={(file) => setProfilePhoto(file)}
                            required
                        />
                    </section>
                )}


                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button type="submit" size="sm" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" size="sm" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </div>
                        ) : 'Save'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateEnrollmentForm;
