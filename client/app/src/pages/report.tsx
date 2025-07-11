import React, { useState } from 'react';
import logo from '../assets/img/logo.png';

const Report = () => {
    const [formData, setFormData] = useState({
        victim_name: '',
        nationality: '',
        contact_number: '',
        alternate_mobile: '',
        email_id: '',
        passport_number: '',
        complaint_type: 'Hotel booking fraud',
        location_of_incident: '',
        nearby_police_station: '',
        date_time_of_offence: '',
        description: '',
    });
    const [mediaFiles, setMediaFiles] = useState<FileList | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMediaFiles(e.target.files);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const submissionData = new FormData();
            
            // Append text fields
            Object.entries(formData).forEach(([key, value]) => {
                submissionData.append(key, value);
            });

            // Append files
            if (mediaFiles) {
                for (let i = 0; i < mediaFiles.length; i++) {
                    submissionData.append('media_files', mediaFiles[i]);
                }
            }

            const res = await fetch('/api/complaints', {
                method: 'POST',
                body: submissionData // No 'Content-Type' header needed
            });

            if (!res.ok) {
                const contentType = res.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to submit complaint');
                } else {
                    const errorText = await res.text();
                    console.error("Server returned non-JSON response:", errorText);
                    throw new Error(`An unexpected server error occurred: ${res.status} ${res.statusText}`);
                }
            }

            setSuccess('Complaint submitted successfully!');
            // Reset form
            setFormData({
                victim_name: '', nationality: '', contact_number: '', alternate_mobile: '',
                email_id: '', passport_number: '', complaint_type: 'Hotel booking fraud',
                location_of_incident: '', nearby_police_station: '', date_time_of_offence: '',
                description: '',
            });
            setMediaFiles(null);
            const fileInput = document.getElementById('file-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 relative">
      <img src={logo} alt="logo" className="h-10 absolute left-5 top-[15px] z-20" />
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <span>Complaint Form</span>
          </div>
          <button type="button" className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Victim Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600 col-span-1">Victim Name</label>
                <input type="text" name="victim_name" value={formData.victim_name} onChange={handleChange} placeholder="Full Name" className="border-b-2 border-gray-200 focus:border-blue-500 outline-none col-span-2" required />
              </div>
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600 col-span-1">Nationality</label>
                <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Your Country" className="border-b-2 border-gray-200 focus:border-blue-500 outline-none col-span-2" required />
              </div>
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600 col-span-1">Contact No.</label>
                <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="+00 000 000 0000" className="border-b-2 border-gray-200 focus:border-blue-500 outline-none col-span-2" required />
              </div>
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600 col-span-1">Alternate Mobile No.</label>
                <input type="text" name="alternate_mobile" value={formData.alternate_mobile} onChange={handleChange} placeholder="+00 000 000 0000" className="border-b-2 border-gray-200 focus:border-blue-500 outline-none col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600 col-span-1">Email ID</label>
                <input type="email" name="email_id" value={formData.email_id} onChange={handleChange} placeholder="email@example.com" className="border-b-2 border-gray-200 focus:border-blue-500 outline-none col-span-2" required />
              </div>
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600 col-span-1">Passport No.</label>
                <input type="text" name="passport_number" value={formData.passport_number} onChange={handleChange} placeholder="Your Passport Number" className="border-b-2 border-gray-200 focus:border-blue-500 outline-none col-span-2" />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Complaint Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600 col-span-1">Type of Complaint</label>
                <select name="complaint_type" value={formData.complaint_type} onChange={handleChange} className="border-2 rounded-md p-2 col-span-2" required>
                    <option>Hotel booking fraud</option>
                    <option>Tour guide scam</option>
                    <option>Transportation scam</option>
                    <option>Visa/passport scam</option>
                    <option>Theft</option>
                    <option>Other</option>
                </select>
              </div>
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600 col-span-1">Location of Incident</label>
                <input type="text" name="location_of_incident" value={formData.location_of_incident} onChange={handleChange} placeholder="City or area of incident" className="border-b-2 border-gray-200 focus:border-blue-500 outline-none col-span-2" required />
              </div>
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600 col-span-1">Nearby Police Station</label>
                <input type="text" name="nearby_police_station" value={formData.nearby_police_station} onChange={handleChange} placeholder="Enter the name of nearest police station" className="border-b-2 border-gray-200 focus:border-blue-500 outline-none col-span-2" />
              </div>
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600 col-span-1">Date and Time of Offence</label>
                <input type="datetime-local" name="date_time_of_offence" value={formData.date_time_of_offence} onChange={handleChange} className="border-b-2 border-gray-200 focus:border-blue-500 outline-none col-span-2" required />
              </div>
              <div className="grid grid-cols-3 items-start">
                <label className="text-gray-600 col-span-1 mt-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the incident in detail..." rows={4} className="border-2 rounded-md p-2 col-span-2" required></textarea>
              </div>
              <div className="grid grid-cols-3 items-center">
                <label className="text-gray-600 col-span-1">Upload Media</label>
                <input type="file" id="file-input" multiple onChange={handleFileChange} className="col-span-2" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-8">
          <button type="button" className="text-gray-600 hover:text-gray-800 mr-4 cursor-pointer">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'File Complaint'} 
          </button>
        </div>
      </form>
    </div>
  );
};

export default Report; 