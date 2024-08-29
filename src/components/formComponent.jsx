import React, { useState } from 'react';

function FormComponent() {
  const [selectedFile, setSelectedFile] = useState();
  const[isSelected, setIsSelected]= useState(false) 
  const handleChange = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsSelected(true);
	};
  const handleSubmit = () => {
    if(isSelected=== true){
       alert("File uploded");
    } else{
       alert("upload a file");
    }
 };
   return (
    <>
     <form>
    <h2>Upload a file</h2>
			<input type="file" name="file" onChange={handleChange} />
			{isSelected ? (
				<div>
                    <h2>File Details</h2>
					<p>Filename: {selectedFile.name}</p>
					<p>Filetype: {selectedFile.type}</p>
					<p>Size in bytes: {selectedFile.size}</p>
					<p>
						lastModifiedDate:{' '}
						{selectedFile.lastModifiedDate.toLocaleDateString()}
					</p>
				</div>
			) : (
				<p>Select a file to show details</p>
			)}
			<div>
				<button onClick={handleSubmit}>Submit</button>
			</div>
		</form>
  </>
  );
}

export default FormComponent;
