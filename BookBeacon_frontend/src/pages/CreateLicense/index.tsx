import React, { useState } from "react";
import "./index.css";
import Navbar from "../../components/common/Navbar";
import filteredData from "../ViewLicenses/data";
import { useSelector } from "react-redux";
import { selectLicenseState } from "../../store/selectors/License.selector";
import { createLicense } from "../../services/license";
import { searchBundles } from "../../services/bundle";
import { useNavigate } from "react-router-dom";

const bundleNames = [
  "ariddles24", "ngilderoyy", "kbrandi0", "bgariff3", "ramorta", "kbrandi0", "lironl",
  "cmeir1", "ariddles24", "bgariff3", "msuthren6", "ramorta", "kbrandi0", "smccooked",
  "bgariff3", "bgariff3", "rvickerstaffb", "smccooked", "kbrandi0", "jtonner2", "lironl",
  "bgariff3", "rvickerstaffb", "ramorta", "cmeir1", "mgregoraceo", "lironl", "lironl",
  "rvickerstaffb", "iiskow14", "ngilderoyy", "rblint5", "hflasby1v", "smccooked",
  "rvickerstaffb", "rvickerstaffb", "mgregoraceo", "rblint5", "hflasby1v", "ngilderoyy",
  "kbrandi0"
];

const debounce = (func, delay) => {
  let timeoutId = delay;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const CreateLicense = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("Premium");
  const [licenseName, setLicenseName] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [selectedBundle, setSelectedBundle] = useState("");
  const [selectedBundleId, setSelectedBundleID] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [query, setQuery] = useState("");
  const [filteredBundles, setFilteredBundles] = useState([]);

  const [formData, setFormData] = useState<any>({});

  const LicenseReduxState = useSelector(selectLicenseState);

  // Function to handle search and filtering
  const handleSearch = debounce(async (input: any) => {
    // if (input.length < 3) {
    //   setFilteredBundles([]); // If input is less than 3 characters, don't show suggestions
    //   return;
    // }
    // const lowerCaseInput = input.toLowerCase();
    const results = await searchBundles(input);
    console.log(results);
    const bundles = results.data;

    setFilteredBundles(bundles);



  }, 300); // Delay of 300ms for debouncing

  const handleInputChange = (event: any) => {
    setQuery(event.target.value);
    handleSearch(event.target.value); // Trigger the debounced search
  };

  const handleBundleClick = (bundle: any) => {
    console.log(bundle);
    // setSelectedBundle(bundle);
    setSelectedBundleID(bundle.bundle_id);
    console.log(selectedBundleId);
    // setQuery(bundle); // Set the input value to the selected bundle
    setFilteredBundles([]); // Clear the suggestions once a bundle is selected
  };

  const today = new Date().toISOString().split("T")[0];

  const handleLicenseSelection = (licenseType: string) => {
    setMode(licenseType);
  };

  const handleEndDateChange = (event: any) => {
    const selectedEndDate = event.target.value;
    setEndDate(selectedEndDate);

    // Check if end date is after the start date
    if (startDate && selectedEndDate && selectedEndDate <= startDate) {
      setErrorMessage("End Date must be after Start Date.");
    } else {
      setErrorMessage("");
    }
  };
  const handleClearBundle = () => {
    setSelectedBundle("");
    setQuery("");
  };

  // const handleLicenseType = (
  //   _event: React.MouseEvent<HTMLElement>,
  //   newType: string | null
  // ) => {
  //   if (newType !== null) {
  //     setLicenseType(newType);
  //   }
  //  };
  async function handleSubmit(e: any) {
    e.preventDefault();
    const data: any = {
      "license_name": licenseName,
      "bundle_id": selectedBundleId,
      "mode": mode,
      "start_date": startDate,
      "end_date": endDate,
      "purchase_date": purchaseDate,
    }


    // "concurrency": LicenseReduxState.concurrency,
    if (LicenseReduxState.isVariableConcurrency) {
      //we will updated books ()

      data.booksInBundle = LicenseReduxState.booksInBundle;

      const response = await createLicense(data, "variable");

      console.log(response)
      //callCreateLicenseAPI(data, variable);

    }
    else { // single concurrency update 
      data.concurrency = LicenseReduxState.concurrency;

      await createLicense(data, "default");

    }
    console.log(data);
  }
  // }

  // function callSearchAPI(query) {
  // const filteredList = getBundlesBySearch(query);
  // setFilteredBundles(filteredList)
  // }
  return (
    <div>
      <Navbar />
      <div className="create-license-container">
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="container">
            <h1 className="container-title">LICENSE DETAILS</h1>
            {/* <!-- License Type --> */}
            <div className="license-type">
              <button
                className={`license-btn ${mode === "Premium" ? "active" : ""
                  }`}
                onClick={() => handleLicenseSelection("Premium")}
              >
                Premium
              </button>
              <button
                className={`license-btn ${mode === "Normal" ? "active" : ""
                  }`}
                onClick={() => handleLicenseSelection("Normal")}
              >
                Normal
              </button>
            </div>
            <div className="form-section">
              <label htmlFor="license-name">
                License Name<span className="required"> * </span>
              </label>
              <input
                type="text"
                id="license-name"
                required
                placeholder="Enter License Name"
                onChange={(e) => setLicenseName(e.target.value)}
              />



              <label htmlFor="start-date">
                Select Start Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="start-date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />


              <label htmlFor="end-date">
                Select End Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="end-date"
                required
                value={endDate}
                onChange={handleEndDateChange}
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}

              <label htmlFor="purchase-date">
                Select Purchase Date <span className="required">*</span>
              </label>
              <input
                type="date"
                id="purchase-date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}

                required
              />
            </div>

          </div>
          <div className="container">

            <h1 className="container-title">PRODUCT BUNDLE</h1>
            {/* <!-- Product Bundle --> */}
            <div className="form-section">
              <label htmlFor="bundle-name">Product Bundle <span className="required">*</span> </label>
              <div className="input-container">
                <input
                  type="text"
                  id="bundle-name"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Search by Bundle Name"
                  disabled={!!selectedBundle}
                />
                {!selectedBundle && <i className="fa fa-search"></i>}
                {selectedBundle && <i className="clear-icon" onClick={handleClearBundle}>✖</i>}
              </div>
              {filteredBundles.length > 0 && (
                <ul className="bundle-list">
                  {filteredBundles.map((bundle, index) => (
                    <li
                      key={index}
                      onClick={() => handleBundleClick(bundle)}
                      className="bundle-item"
                    >
                      {bundle.bundle_Name}
                    </li>
                  ))}
                </ul>
              )}
              {selectedBundle && (
                <div className="selected-bundle">
                  <strong>Selected Bundle: </strong> {selectedBundle}
                </div>
              )}
              <div className="product-status">
                <span className="available">Available: 2</span>
                <span className="forthcoming">Forthcoming: 0</span>
                <span className="invalid">Invalid: 0</span>
              </div>
            </div>

            {/* <!-- DRM Policies --> */}
          </div>
          <div className="container">
            <h1 className="container-title">DRM POLICES</h1>
            <div className="form-section drm-policies">
              <div className="content">2 titles are DRM protected. Please review/edit the titles. </div>
              <div className="policy">
                <span>Concurrency: 1</span>
                <span>Print/Copy: 20</span>
              </div>
              <a href="/license">View/Edit concurrency per title</a>
            </div>

            {/* <!-- Save/Cancel Buttons --> */}

          </div >
          <div className="form-section buttons">
            <button className="save-btn" type="submit">Save</button>
            <button className="cancel-btn" onClick={() => navigate("/licenses")} type="button">Cancel</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateLicense;
