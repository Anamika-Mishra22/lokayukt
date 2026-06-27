import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { toast, Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE ?? "http://localhost:8000/api";
const token = Cookies.get("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// const ComplaintPrintView = React.forwardRef(({ complainants, persons, formData }, ref) => {
//   const formatYesNo = (val) =>
//     val === 'हाँ' || val === 'नहीं'
//       ? val
//       : val === '1'
//       ? 'हाँ'
//       : val === '0'
//       ? 'नहीं'
//       : '';

//   return (
//    <div ref={ref} className="rounded-md text-[12px] leading-relaxed text-gray-900">
//       <div className="w-full h-full px-8 pt-8 pb-10">
//         <div className="text-center mb-2">
//           <p className="font-semibold text-[13px]">
//             "शिकायत", "अभिकथन" उत्तर प्रदेश लोक आयुक्त तथा माननीय उप लोक आयुक्त अधिनियम, 1975
//           </p>
//         </div>

//         <div className="text-[12px]">
//           {/* 1 */}
//           <div className="flex gap-2">
//             <span className="min-w-[18px]">1.</span>
//             <div className="flex-1">
//               <span>परिवादी का नाम :</span>
//               <div className="mt-0.5 pl-4 space-y-0.5">
//                 {complainants.map((c, idx) => (
//                   <div key={c.id || idx}>
//                     परिवादी {idx + 1} {c.isMain === 1 ? '(मुख्य)' : ''} : <span className="kruti-input">{c.name || '——'}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* 2 */}
//           <div className="flex gap-2">
//             <span className="min-w-[18px]">2.</span>
//             <div className="flex-1">
//               <span>पिता का नाम :</span>
//               <div className="mt-0.5 pl-4 space-y-0.5">
//                 {complainants.map((c, idx) => (
//                   <div key={c.id || idx}>
//                     परिवादी {idx + 1} : <span className="kruti-input">{c.fatherName || '——'}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* 3 */}
//           <div className="flex gap-2">
//             <span className="min-w-[18px]">3.</span>
//             <div className="flex-1 space-y-0.5">
//               <div>
//                 <span>(क) व्यवसाय :</span>
//                 <div className="mt-0.5 pl-4 space-y-0.5">
//                   {complainants.map((c, idx) => (
//                     <div key={c.id || idx}>
//                       परिवादी {idx + 1} : <span className="kruti-input">{c.occupation || '——'}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <span>(ख) क्या आप लोक सेवक हैं या नहीं :</span>
//                 <div className="mt-0.5 pl-4 space-y-0.5">
//                   {complainants.map((c, idx) => (
//                     <div key={c.id || idx}>
//                       परिवादी {idx + 1} : <span className="">{formatYesNo(c.isPublicServant) || '——'}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//             </div>
//           </div>

//           {/* 4 स्थायी पता */}
//           <div className="flex gap-2 mt-1">
//             <span className="min-w-[18px]">4.</span>
//             <div className="flex-1 space-y-0.5">
//               <div>स्थायी पता :</div>
//               <div className="pl-4 space-y-2 mt-1">
//                 {complainants.map((c, idx) => (
//                    <div key={c.id || idx} className="mb-1 pb-1 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
//                       <div className="font-semibold text-[11px] mb-0.5">
//                         [ परिवादी {idx + 1} {c.isMain === 1 ? '(मुख्य)' : ''} ]
//                       </div>
//                       <div>(ख) स्थान : <span className="kruti-input">{c.place || '——'}</span></div>

                      
//                       <div>(ग) डाकघर या पुलिस थाना : <span className="kruti-input">{c.postOffice || '——'}</span></div>
//                       <div>(घ) जिला : <span className="kruti-input">{c.district || '——'}</span></div>
//                    </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div>
//             <span>
//               यदि परिवाद किसी दूसरे व्यक्ति की ओर से है तो उस व्यक्ति के साथ अपना संबंध बतायें। यह साबित करने के लिए कि
//               आप उसकी सम्पदा का प्रतिनिधित्व करतें हैं या उसने इस निमित्त आपको प्राधिकृत किया है, दस्तावेज भी यदि कोई हो,
//               संलग्न करें।
//             </span>
//             <div className="mt-0.5 pl-4">
//               <span className="kruti-input">{formData.relation || '——'}</span>
//               {formData.authorizationFile && (
//                 <div className="mt-0.5 text-[11px] text-gray-700">
//                   (संलग्न दस्तावेज़: <span className="kruti-input">{formData.authorizationFile.name}</span>)
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* 5 पत्राचार पता */}
//           <div className="flex gap-2">
//             <span className="min-w-[18px]">5.</span>
//             <div className="flex-1 space-y-0.5">
//               <div>पता जिसपर सूचना भेजी जाय :</div>
//               <div className="pl-4 space-y-0.5">
//                 <div>(क) नाम : <span className="kruti-input">{formData.correspondenceAddress.name || '——'}</span></div>
//                 <div>(ख) स्थान : <span className="kruti-input">{formData.correspondenceAddress.place || '——'}</span></div>
//                 <div>(ग) डाकघर या पुलिस थाना : <span className="kruti-input">{formData.correspondenceAddress.postOffice || '——'}</span></div>
//                 <div>(घ) जिला : <span className="">{formData.correspondenceAddress.district || '——'}</span></div>
//               </div>
//             </div>
//           </div>

//           {/* 6 प्रतिवादी */}
//           <div className="flex gap-2 mt-1">
//             <span className="min-w-[18px]">6.</span>
//             <div className="flex-1 space-y-0.5">
//               <div>
//                 (1) जिस व्यक्ति के विरूद्ध परिवाद किया जा रहा है उसका नाम, पदनाम जो मामले के विषय में परिवाद किये जाने के समय पर रहा हो और वर्तमान
//                 पता यदि ज्ञात हो :
//               </div>
//               <div className="pl-4 space-y-2 mt-1">
//                 {persons.map((p, idx) => (
//                   <div
//                     key={p.id || idx}
//                     className="border border-dashed border-orange-300 px-2 py-1 rounded-sm mb-1"
//                   >
//                     <div className="font-bold mb-0.5">व्यक्ति {idx + 1} {p.isMain === 1 ? '(मुख्य)' : ''}</div>
//                     <div>नाम : <span className="kruti-input">{p.name || '——'}</span></div>
//                     <div>पदनाम : <span className="">{p.designation || '——'}</span></div>
//                     <div>वर्तमान पता : <span className="kruti-input">{p.currentAddress || '——'}</span></div>
//                     <div>ज़िला : <span className="kruti-input">{p.district || '——'}</span></div>
//                     <div>विभाग : <span className="kruti-input">{p.departmentNature || '——'}</span></div>
//                     <div>श्रेणी : <span className="">{p.officerCategory || '——'}</span></div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-0.5">
//                 (2) दिनांक जब परिवाद का कारण उत्पन्न हुआ हो : <span className="kruti-input">{formData.complaintDate || '——'}</span>
//               </div>
//               <div>
//                 (3) परिवाद विलम्ब से प्रस्तुत करने का कारण, यदि परिवाद धारा 8 की उपधारा (4) के अधीन समय व्यतीत हो जाने पर किया गया हो :
//                 <div className="mt-0.5 pl-4 kruti-input">{formData.delayReason || '——'}</div>
//               </div>
//               <div>
//                 (4) क्या परिवाद पहले किसी वरिष्ठ अधिकारी के समक्ष किया गया था? या किसी अधिकरण या न्यायालय के समक्ष कार्यवाही की गई थी, यदि हों तो
//                 उसका क्या परिणाम निकला, यदि नही, कृपया संक्षेप में कारण बतायें।
//                 <div className="mt-0.5 pl-4">
//                   {formData.previousComplaint ? (
//                     <>
//                       उत्तर : <span className="">{formData.previousComplaint}</span>
//                       {formData.previousComplaint === 'हाँ' && formData.previousComplaintDetails && (
//                         <>
//                           , विवरण : <span className="kruti-input">{formData.previousComplaintDetails}</span>
//                         </>
//                       )}
//                     </>
//                   ) : (
//                     '——'
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* 7 */}
//           <div className="flex gap-2 mt-1">
//             <span className="min-w-[18px]">7.</span>
//             <div className="flex-1">
//               क्या यह,
//               (क) कोई अभिकथन अधिनियम की धारा 2 (ख) में यथा परिभाषित, है? या शिकायत अधिनियम की धारा 2 (घ) में यथा परिभाषित, है।
//               <div className="mt-0.5 pl-4">
//                 श्रेणी : <span className="">{formData.complaintType || '——'}</span>
//               </div>
//             </div>
//           </div>

//           {/* 8 चालान (Only if Assertion/Abhikathan) */}
//           {formData.complaintType === 'अभिकथन' && (
//             <div className="flex gap-2 mt-1">
//               <span className="min-w-[18px]">8.</span>
//               <div className="flex-1 space-y-0.5">
//                 <div>
//                   चालान संख्या और नियम-4 के अधीन खर्च के लिए प्रतिभूति जमा करने का दिनांक -
//                   <div className="mt-0.5 pl-4 space-y-0.5">
//                     <div>चालान संख्या : <span className="kruti-input">{formData.challanNumber || '——'}</span></div>
//                     <div>दिनांक : <span className="kruti-input">{formData.challanDate || '——'}</span></div>
//                     {formData.challanFile && (
//                       <div>फ़ाइल : <span className="kruti-input">{formData.challanFile.name}</span></div>
//                     )}
//                   </div>
//                 </div>
//                 <div className="pl-4 text-[11px] text-gray-700 space-y-0.5">
//                   <div>
//                     टिप्पणी (1) उक्त धनराशि शीर्षक "8443-सिविल निक्षेप-00-103-प्रतिभूति निक्षेप-00-00" के अधीन भारतीय स्टेट बैंक की किसी भी
//                     शाखा में जमा की जा सकती है।
//                   </div>
//                   <div>(2) किसी "शिकायत" की स्थिति में कोई धनराशि जमा करना अपेक्षित नहीं है।</div>
//                   <div>(3) चालान की एक प्रति परिवाद के साथ संलग्न की जाए। नियम 8 (2) देखिए,</div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* 9 - FIXED: Now properly maps array data */}
//           <div className="flex gap-2 mt-1">
//             <span className="min-w-[18px]">9.</span>
//             <div className="flex-1">
//               ऐसे व्यक्तियों की सूची जिन्होने परिवाद के समर्थन में शपथपत्र दिये हों।
//               <div className="mt-0.5 pl-4">
//                 {Array.isArray(formData.supportingPersons) && formData.supportingPersons.length > 0
//                   ? formData.supportingPersons.map((p, i) => (
//                       <div key={i} className="mb-0.5">
//                         {i + 1}. <span className="kruti-input">{p.name}</span> {p.address ? <>(पता: <span className="kruti-input">{p.address}</span>)</> : ''}
//                       </div>
//                     ))
//                   : '——'}
//               </div>
//             </div>
//           </div>

//           {/* 10 - FIXED: Now properly maps array data */}
//           <div className="flex gap-2">
//             <span className="min-w-[18px]">10.</span>
//             <div className="flex-1">
//               क्या ऐसे अन्य व्यक्ति भी है जिन्हे परिवाद से सम्बन्धित तथ्यों के बारे में जानकारी हो, जिन्हे लोक आयुक्त/उप लोक आयुक्त द्वारा समन करना चाहें।
//               <div className="mt-0.5 pl-4">
//                 {Array.isArray(formData.otherPersons) && formData.otherPersons.length > 0
//                   ? formData.otherPersons.map((p, i) => (
//                       <div key={i} className="mb-0.5">
//                         {i + 1}. <span className="kruti-input">{p.name}</span> {p.address ? <>(पता: <span className="kruti-input">{p.address}</span>)</> : ''}
//                       </div>
//                     ))
//                   : '——'}
//               </div>
//             </div>
//           </div>

//           {/* 11 */}
//           <div className="flex gap-2">
//             <span className="min-w-[18px]">11.</span>
//             <div className="flex-1">
//               परिवाद से सम्बन्धित संलग्न दस्तावेजों की सूची जिसमें परिवादी का शपथपत्र भी सम्मिलित है।
//               <div className="mt-0.5 pl-4">
//                 <span className="kruti-input">
//                   {formData.attachedDocumentsFile ? formData.attachedDocumentsFile.name : (formData.attachedDocuments || '——')}
//                 </span>
//                 {formData.attachedDocuments && (
//                   <div className="text-[10px] mt-1 text-gray-600 kruti-input">
//                     {formData.attachedDocuments}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* 12 */}
//           <div className="flex gap-2">
//             <span className="min-w-[18px]">12.</span>
//             <div className="flex-1">
//               परिवाद का विवरण - कृपया यहाँ पर परिवाद के सम्पूर्ण तथ्य बतायें।
//               <div className="mt-0.5 pl-4 whitespace-pre-wrap break-words kruti-input">
//                 {formData.complaintDescription || '——'}
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// });

const ComplaintPrintView = React.forwardRef(({ complainants, persons, formData, districtList }, ref) => {
  const formatYesNo = (val) => {
    if (val === 'हाँ' || val === 'yes' || val === '1') return 'हाँ';
    if (val === 'नहीं' || val === 'no' || val === '0') return 'नहीं';
    return '——';
  };

  // const "miyC/k ugha" = 'उपलब्ध नहीं';

  // 🔥 यह नया फंक्शन नंबर (Code) को ज़िले के नाम में बदल देगा
  const getDistrictName = (code) => {
    if (!code) return "miyC/k ugha";
    const district = districtList?.find(d => String(d.district_code) === String(code));
    return district ? district.district_name : code;
  };

  return (
    <div ref={ref} className="rounded-md text-[16px] leading-relaxed text-gray-900">
      <div className="w-full h-full px-8 pt-8 pb-10">
        
        <div className="text-center mb-2">
          <p className="font-semibold text-[13px]">
            {/* "शिकायत", "अभिकथन" उत्तर प्रदेश लोक आयुक्त तथा माननीय उप लोक आयुक्त अधिनियम, 1975 */}
            "शिकायत", "अभिकथन" उत्तर प्रदेश लोक आयुक्त तथा उप लोक आयुक्त अधिनियम, 1975 की
          </p>
          <h1 className="mt-1 text-sm">
              {/* धारा 2 (ख) और (घ) में यथापरिभाषित, संबंधी परिवाद का प्रपत्र जो लोक आयुक्त / माननीय उप लोक आयुक्त को दिया जायेगा। */}
              धारा 2 (ख) और (घ) में यथापरिभाषित, संबंधी परिवाद का प्रपत्र जो लोक आयुक्त / उप लोक आयुक्त को दिया जायेगा।
            </h1>
        </div>

        <div className="text-[12px]">
          
          {/* 1 */}
          <div className="flex gap-2">
            <span className="min-w-[18px]">1.</span>
            <div className="flex-1">
              <span>परिवादी का नाम :</span>
              <div className="mt-0.5 pl-4 space-y-0.5">
                {complainants.map((c, idx) => (
                  <div key={c.id || idx}>
                    परिवादी {idx + 1} {c.isMain === 1 ? '(मुख्य)' : ''} : <span className="kruti-input text-[16px]">{c.name || "miyC/k ugha"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2 */}
          <div className="flex gap-2">
            <span className="min-w-[18px]">2.</span>
            <div className="flex-1">
              <span>पिता या पति का नाम :</span>
              <div className="mt-0.5 pl-4 space-y-0.5">
                {complainants.map((c, idx) => (
                  <div key={c.id || idx}>
                    परिवादी {idx + 1} : <span className="kruti-input text-[16px]">{c.fatherName || "miyC/k ugha"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 */}
          <div className="flex gap-2">
            <span className="min-w-[18px]">3.</span>
            <div className="flex-1 space-y-0.5">
              <div>
                <span>(क) व्यवसाय :</span>
                <div className="mt-0.5 pl-4 space-y-0.5">
                  {complainants.map((c, idx) => (
                    <div key={c.id || idx}>
                      परिवादी {idx + 1} : <span className="kruti-input text-[16px]">{c.occupation || "miyC/k ugha"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span>(ख) क्या आप लोक सेवक हैं या नहीं :</span>
                <div className="mt-0.5 pl-4 space-y-0.5">
                  {complainants.map((c, idx) => (
                    <div key={c.id || idx}>
                      परिवादी {idx + 1} : <span className="">{formatYesNo(c.isPublicServant) }</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3(ग) संबंध */}
          <div className="mt-1">
            <span>
              (ग). यदि परिवाद किसी दूसरे व्यक्ति की ओर से है तो उस व्यक्ति के साथ अपना संबंध बताएं। यह साबित करने के लिए कि आप उसकी सम्मति का प्रतिनिधित्व करते हैं या उसने इस निमित्त आपको प्राधिकृत किया है, दस्तावेज़ भी यदि कोई हो, संलग्न करें।
            </span>
            <div className="mt-0.5 pl-4 space-y-2">
              {complainants.map((c, idx) => (
                <div key={c.id || idx}>
                  <div className="kruti-input text-[16px]">{c.relation || "miyC/k ugha"}</div>
                  {c.authorizationFile && (
                    <div className="mt-0.5 text-[11px] text-gray-700">
                      (यह साबित करने के लिए कि आप उसकी सम्पदा का प्रतिनिधित्व करते हैं या उसने इस निमित्त आपको प्राधिकृत किया है, संबंधित दस्तावेज संलग्न करें : <span className="kruti-input text-[16px]">{c.authorizationFile.name}</span>)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4 स्थायी पता */}
          <div className="flex gap-2 mt-1">
            <span className="min-w-[18px]">4.</span>
            <div className="flex-1 space-y-0.5">
              <div>स्थायी पता :</div>
              <div className="pl-4 space-y-2 mt-1">
                {complainants.map((c, idx) => (
                   <div key={c.id || idx} className="mb-1 pb-1 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                      <div className="font-semibold text-[11px] mb-0.5">
                        [ परिवादी {idx + 1} {c.isMain === 1 ? '(मुख्य)' : ''} ]
                      </div>
                      <div>(क) नाम : <span className="kruti-input text-[16px]">{c.permanentName || "miyC/k ugha"}</span></div>
                      <div>(ख) स्थान : <span className="kruti-input text-[16px]">{c.place || "miyC/k ugha"}</span></div>
                      <div>(ग) डाकघर या पुलिस थाना : <span className="kruti-input text-[16px]">{c.postOffice || "miyC/k ugha"}</span></div>
                      {/* 🔥 District update */}
                      <div>(घ) जिला : <span className="kruti-input text-[16px]">{getDistrictName(c.district)}</span></div>
                   </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5 पत्राचार पता */}
          <div className="flex gap-2 mt-1">
            <span className="min-w-[18px]">5.</span>
            <div className="flex-1 space-y-0.5">
              <div>पता जिस पर सूचना भेजी जाये :</div>
              <div className="pl-4 space-y-0.5">
                <div>(क) नाम : <span className="kruti-input text-[16px]">{formData.correspondenceAddress.name || "miyC/k ugha"}</span></div>
                <div>(ख) स्थान : <span className="kruti-input text-[16px]">{formData.correspondenceAddress.place || "miyC/k ugha"}</span></div>
                <div>(ग) डाकघर या पुलिस थाना : <span className="kruti-input text-[16px]">{formData.correspondenceAddress.postOffice || "miyC/k ugha"}</span></div>
                {/* 🔥 District update */}
                <div>(घ) जिला : <span className="kruti-input text-[16px]">{getDistrictName(formData.correspondenceAddress.district)}</span></div>
              </div>
            </div>
          </div>

          {/* 6 प्रतिवादी */}
          <div className="flex gap-2 mt-1">
            <span className="min-w-[18px]">6.</span>
            <div className="flex-1 space-y-0.5">
              <div>
                (1) जिस व्यक्ति के विरुद्ध परिवाद किया जा रहा है उसका नाम, पदनाम (जो मामले के विषय में परिवाद किये जाने के समय पर रहा हो) और वर्तमान पता (यदि ज्ञात हो) :
              </div>
              <div className="pl-4 space-y-2 mt-1">
                {persons.map((p, idx) => (
                  <div key={p.id || idx} className="border border-dashed border-orange-300 px-2 py-1 rounded-sm mb-1">
                    <div className="font-bold mb-0.5">व्यक्ति {idx + 1} {p.isMain === 1 ? '(मुख्य)' : ''}</div>
                    <div>नाम : <span className="kruti-input text-[16px]">{p.name || "miyC/k ugha"}</span></div>
                    <div>पदनाम : <span className="kruti-input">{p.designation || "miyC/k ugha"}</span></div>
                    <div>श्रेणी : <span className="kruti-input">{p.officerCategory || "miyC/k ugha"}</span></div>
                    <div>विभाग का नाम : <span className="kruti-input text-[16px]">{p.departmentNature || "miyC/k ugha"}</span></div>
                    {/* 🔥 District update */}
                    <div>ज़िला : <span className="kruti-input text-[16px]">{getDistrictName(p.district)}</span></div>
                    <div>वर्तमान पता (यदि ज्ञात हो) : <span className="kruti-input text-[16px]">{p.currentAddress || "miyC/k ugha"}</span></div>
                  </div>
                ))}
              </div>
              <div className="mt-0.5">
                (2) दिनांक जब परिवाद का कारण उत्पन्न हुआ हो। : <span className="kruti-input text-[16px]">{formData.complaintDate || "miyC/k ugha"}</span>
              </div>
              <div>
                (3) परिवाद विलम्ब से प्रस्तुत करने का कारण, यदि परिवाद धारा 8 की उपधारा (4) के अधीन समय व्यतीत हो जाने पर किया गया हो :
                <div className="mt-0.5 pl-4 kruti-input text-[16px]">{formData.delayReason || "miyC/k ugha"}</div>
              </div>
              <div>
                (4) क्या परिवाद पहले किसी वरिष्ठ अधिकारी के समक्ष किया गया था? या किसी अधिकरण या न्यायालय के समक्ष कार्यवाही की गई थी, यदि हाँ, तो उसका क्या परिणाम निकला, यदि नहीं, कृपया संक्षेप में कारण बतायें?
                <div className="mt-0.5 pl-4">
                  {formData.previousComplaint ? (
                    <>
                      उत्तर : <span className="">{formData.previousComplaint}</span>
                      {formData.previousComplaint === 'हाँ' && formData.previousComplaintDetails && (
                        <>
                          , विवरण : <span className="kruti-input text-[16px]">{formData.previousComplaintDetails}</span>
                        </>
                      )}
                    </>
                  ) : (
                    "उपलब्ध नहीं"
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 7 */}
          <div className="flex gap-2 mt-1">
            <span className="min-w-[18px]">7.</span>
            <div className="flex-1">
              क्या यह, (क) कोई अभिकथन अधिनियम की धारा 2 (ख) में यथा परिभाषित है? या (ख) शिकायत अधिनियम की धारा 2 (घ) में यथा परिभाषित है।
              <div className="mt-0.5 pl-4">
                श्रेणी : <span className="">{formData.complaintType || "उपलब्ध नहीं"}</span>
              </div>
            </div>
          </div>

          {/* 8 चालान */}
          {formData.complaintType === 'अभिकथन' && (
            <div className="flex gap-2 mt-1">
              <span className="min-w-[18px]">8.</span>
              <div className="flex-1 space-y-0.5">
                <div>
                  चालान संख्या और नियम-4 के अधीन खर्च के लिए प्रतिभूति जमा करने का दिनांक :
                  <div className="mt-0.5 pl-4 space-y-0.5">
                    <div>चालान संख्या : <span className="kruti-input text-[16px]">{formData.challanNumber || "miyC/k ugha"}</span></div>
                    <div>दिनांक : <span className="kruti-input text-[16px]">{formData.challanDate || "miyC/k ugha"}</span></div>
                    {formData.challanFile && (
                      <div>चालान की प्रति (स्कैन / PDF) : <span>{formData.challanFile.name}</span></div>
                    )}
                  </div>
                </div>
                <div className="pl-4 text-[11px] text-gray-700 space-y-0.5 mt-2">
                  <div>टिप्पणी (1) उक्त धनराशि शीर्षक "8443-सिविल निक्षेप-00-103-प्रतिभूति निक्षेप-00-00" के अधीन भारतीय स्टेट बैंक की किसी भी शाखा में जमा की जा सकती है।</div>
                  <div>(2) किसी "शिकायत" की स्थिति में कोई धनराशि जमा करना अपेक्षित नहीं है।</div>
                  <div>(3) चालान की एक प्रति परिवाद के साथ संलग्न की जाए (नियम 8 (2) देखें)।</div>
                </div>
              </div>
            </div>
          )}

          {/* 9 */}
          <div className="flex gap-2 mt-1">
            <span className="min-w-[18px]">9.</span>
            <div className="flex-1">
              ऐसे व्यक्तियों की सूची जिन्होने परिवाद के समर्थन में शपथपत्र दिये हों :
              <div className="mt-0.5 pl-4">
                {Array.isArray(formData.supportingPersons) && formData.supportingPersons.length > 0 && formData.supportingPersons[0].name !== ""
                  ? formData.supportingPersons.map((p, i) => (
                      <div key={i} className="mb-0.5">
                        {i + 1}. <span className="kruti-input text-[16px]">{p.name}</span> {p.address ? <>(पता: <span className="kruti-input text-[16px]">{p.address}</span>)</> : ''}
                      </div>
                    ))
                  : "उपलब्ध नहीं"}
              </div>
            </div>
          </div>

          {/* 10 */}
          <div className="flex gap-2 mt-1">
            <span className="min-w-[18px]">10.</span>
            <div className="flex-1">
              क्या ऐसे अन्य व्यक्ति भी हैं जिन्हें परिवाद से सम्बन्धित तथ्यों के बारे में जानकारी हो, जिन्हें लोक आयुक्त / उप लोक आयुक्त द्वारा समन करना चाहें ।
              <div className="mt-0.5 pl-4">
                {Array.isArray(formData.otherPersons) && formData.otherPersons.length > 0 && formData.otherPersons[0].name !== ""
                  ? formData.otherPersons.map((p, i) => (
                      <div key={i} className="mb-0.5">
                        {i + 1}. <span className="kruti-input text-[16px]">{p.name}</span> {p.address ? <>(पता: <span className="kruti-input text-[16px]">{p.address}</span>)</> : ''}
                      </div>
                    ))
                  : "उपलब्ध नहीं"}
              </div>
            </div>
          </div>

          {/* 11 */}
          <div className="flex gap-2 mt-1">
            <span className="min-w-[18px]">11.</span>
            <div className="flex-1">
              परिवाद से सम्बन्धित संलग्न दस्तावेजों की सूची जिसमें परिवादी का शपथपत्र भी सम्मिलित है। :
              <div className="mt-0.5 pl-4">
                <div className="kruti-input text-[16px] whitespace-pre-wrap">
                  {formData.attachedDocuments || "miyC/k ugha"}
                </div>
                {formData.attachedDocumentsFile && (
                  <div className="text-[11px] mt-1 text-gray-600">
                    (संलग्न दस्तावेज़ फाइल अपलोड करें: {formData.attachedDocumentsFile.name})
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 12 */}
          <div className="flex gap-2 mt-1">
            <span className="min-w-[18px]">12.</span>
            <div className="flex-1">
              परिवाद का विवरण – (कृपया यहाँ पर परिवाद के सम्पूर्ण तथ्य बतायें। यदि नीचे दिया गया स्थान अपर्याप्त हो तो अतिरिक्त पृष्ठ जोड़े जा सकते हैं):
              <div className="mt-0.5 pl-4 whitespace-pre-wrap break-words kruti-input text-[18px]">
                {formData.complaintDescription || "miyC/k ugha"}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

ComplaintPrintView.displayName = 'ComplaintPrintView';

const Complaints = () => {

  const navigate = useNavigate();

  
  const printRef = useRef(null);


  const [districtList, setDistrictList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [subjectList, setSubjectList] = useState([]); 
  const [designationList, setDesignationList] = useState([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [distRes, deptRes, subjRes, desigRes] = await Promise.all([
          api.get('/operator/all-district'),
          api.get('/operator/department'),
          api.get('/operator/categories'),
          api.get('/operator/designation')
        ]);

        if(distRes.data.status) setDistrictList(distRes.data.data);
        if(deptRes.data.status) setDepartmentList(deptRes.data.data);
        if(subjRes.data.status) setSubjectList(subjRes.data.data);
        if(desigRes.data.status) setDesignationList(desigRes.data.data);
      } catch (err) {
        console.error("Error fetching master data:", err);
       
      }
    };

    fetchMasterData();
  }, []);


  const [complainants, setComplainants] = useState([
    {
      id: 1,
      name: '',
      fatherName: '',
      occupation: '',
         relation:'',
          authorizationFile: null,
      isPublicServant: 'चुनें',
         isMain: 0,
    }
  ]);

  const [showComplainants, setShowComplainants] = useState({ 1: true });
  const [showAttachedDocs, setShowAttachedDocs] = useState(false);

  const [persons, setPersons] = useState([
    {
      id: 1,
      name: '',
      designation: '',
      currentAddress: '',
      district: '',
      departmentNature: '',
      officerCategory: '',
      isMain: 0, 
    }
  ]);



const handleMainComplainant = (id) => {
  setComplainants(prev =>
    prev.map(c => {
      if (c.id === id) {
        return { ...c, isMain: c.isMain === 1 ? 0 : 1 };
      }
      return { ...c, isMain: 0 }; // ensure only one main
    })
  );
};


const handleMainRespondent = (id) => {
  setPersons(prev =>
    prev.map(p => {
      if (p.id === id) {
        return { ...p, isMain: p.isMain === 1 ? 0 : 1 };
      }
      return { ...p, isMain: 0 };
    })
  );
};


  const [showPersons, setShowPersons] = useState({ 1: true });

  const [formData, setFormData] = useState({
    relation: '',
    authorizationFile: [],
    permanentAddress: { name: '', place: '', postOffice: '', district: '' },
    correspondenceAddress: { name: '', place: '', postOffice: '', district: '' },
    complaintDate: '',
    delayReason: '',
    previousComplaint: '',
    previousComplaintDetails: '',
    complaintType: '',
    challanNumber: '',
    challanDate: '',
    challanFile: null,
    supportingPersons: [{ name: '', address: '' }], 
    otherPersons: [{ name: '', address: '' }], 
    attachedDocuments: '',
    attachedDocumentsFile: null,
    complaintDescription: ''
  });

  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [DraftLoader,setDrfatLoader] = useState(false)
  

const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      if (!printRef.current) {
        toast.error("PDF generate error");
        return;
      }

      const element = printRef.current;
      
      const originalTransform = element.style.transform;
      const originalHeight = element.style.height;
      const originalOverflow = element.style.overflow;

      element.style.transform = 'none';
      element.style.height = 'max-content';
      element.style.overflow = 'visible';
      
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#f3eee6", 
        useCORS: true,
        logging: false,
        allowTaint: true,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      element.style.transform = originalTransform;
      element.style.height = originalHeight;
      element.style.overflow = originalOverflow;

      // A4 Size & Margin Settings
      const A4_WIDTH = 210;
      const A4_HEIGHT = 297;
      const margin = 12; // 🔥 12mm की पैडिंग चारों तरफ
      
      // प्रिंट होने वाले हिस्से की असली चौड़ाई और ऊंचाई (मार्जिन हटाकर)
      const printWidth = A4_WIDTH - (margin * 2);
      const printHeight = A4_HEIGHT - (margin * 2);

      const imgWidth = printWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 1. पूरे पेज का बैकग्राउंड कलर 
      const setPdfBackground = () => {
        pdf.setFillColor(243, 238, 230); // #f3eee6
        pdf.rect(0, 0, A4_WIDTH, A4_HEIGHT, 'F');
      };

      // 2. टॉप और बॉटम मार्जिन को कवर (Mask) करने का फंक्शन
      // इससे इमेज का जो हिस्सा मार्जिन में घुसेगा, वो छुप जाएगा और पैडिंग क्लीन दिखेगी
      const coverMargins = () => {
        pdf.setFillColor(243, 238, 230); 
        pdf.rect(0, 0, A4_WIDTH, margin, 'F'); // Top margin mask
        pdf.rect(0, A4_HEIGHT - margin, A4_WIDTH, margin, 'F'); // Bottom margin mask
      };

      let position = 0;
      const imgData = canvas.toDataURL("image/png");

      // --- पहला पेज (Page 1) ---
      setPdfBackground();
      pdf.addImage(imgData, "PNG", margin, position + margin, imgWidth, imgHeight);
      coverMargins(); // मार्जिन क्लीन करें
      
      let heightLeft = imgHeight - printHeight;

      // --- अगले पेजेस (Next Pages) ---
      while (heightLeft > 0) {
        position = position - printHeight; // इमेज को 'printHeight' जितना ऊपर शिफ्ट करें
        pdf.addPage();
        setPdfBackground(); 
        
        pdf.addImage(imgData, "PNG", margin, position + margin, imgWidth, imgHeight);
        coverMargins(); // ओवरलैप हो रही इमेज को टॉप/बॉटम से छुपाएं
        
        heightLeft -= printHeight;
      }

      const fileName = `Complaint_${new Date().getTime()}.pdf`;
      pdf.save(fileName);

      toast.success("PDF successfully downloaded!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("PDF download error", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsDownloadingPDF(false);
    }
  };


const handlePrint = async () => {
    try {
      if (!printRef.current) {
        toast.error("प्रिंट के लिए कोई डेटा नहीं मिला");
        return;
      }

      // लोडिंग मैसेज दिखाएं
      const loadingToast = toast.loading("प्रिंट की तैयारी हो रही है...");

      const element = printRef.current;
      
      // 1. पुरानी स्टाइल्स का बैकअप लें
      const originalTransform = element.style.transform;
      const originalHeight = element.style.height;
      const originalWidth = element.style.width; // 👈 चौड़ाई का बैकअप
      const originalOverflow = element.style.overflow;

      // 2. चौड़ाई को 794px पर फिक्स करें (ताकि फॉन्ट ना सिकुड़े और व्हाइट स्पेस ना आए)
      element.style.transform = 'none';
      element.style.height = 'max-content';
      element.style.width = '794px'; // 👈 A4 के लिए परफेक्ट चौड़ाई
      element.style.overflow = 'visible';
      
      await new Promise(resolve => setTimeout(resolve, 100));

      // 3. कैप्चर करें (कैनवास की चौड़ाई भी 794px सेट करें)
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#f3eee6", 
        useCORS: true,
        logging: false,
        allowTaint: true,
        scrollY: 0,
        windowWidth: 794, // 👈 794px फिक्स
        windowHeight: element.scrollHeight,
      });

      // 4. कैप्चर के बाद पुरानी स्टाइल्स वापस लगा दें (ताकि स्क्रीन पर कुछ खराब ना दिखे)
      element.style.transform = originalTransform;
      element.style.height = originalHeight;
      element.style.width = originalWidth;
      element.style.overflow = originalOverflow;

      // 5. PDF जनरेट करें
      const A4_WIDTH = 210;
      const A4_HEIGHT = 297;
      const margin = 12; // 12mm पैडिंग
      
      const printWidth = A4_WIDTH - (margin * 2);
      const printHeight = A4_HEIGHT - (margin * 2);

      const imgWidth = printWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const setPdfBackground = () => {
        pdf.setFillColor(243, 238, 230); // #f3eee6
        pdf.rect(0, 0, A4_WIDTH, A4_HEIGHT, 'F');
      };

      const coverMargins = () => {
        pdf.setFillColor(243, 238, 230); 
        pdf.rect(0, 0, A4_WIDTH, margin, 'F'); 
        pdf.rect(0, A4_HEIGHT - margin, A4_WIDTH, margin, 'F'); 
      };

      let position = 0;
      const imgData = canvas.toDataURL("image/png");

      setPdfBackground();
      pdf.addImage(imgData, "PNG", margin, position + margin, imgWidth, imgHeight);
      coverMargins(); 
      
      let heightLeft = imgHeight - printHeight;

      while (heightLeft > 0) {
        position = position - printHeight; 
        pdf.addPage();
        setPdfBackground(); 
        
        pdf.addImage(imgData, "PNG", margin, position + margin, imgWidth, imgHeight);
        coverMargins(); 
        
        heightLeft -= printHeight;
      }

      toast.dismiss(loadingToast);

      // 🔥 जादुई ट्रिक: PDF को 'ऑटो-प्रिंट' मोड में सेट करें और नए टैब में खोलें
  const printWindow = window.open(pdf.output("bloburl"), "_blank");

setTimeout(() => {
  printWindow.print();
}, 1000);

    } catch (error) {
      console.error("Print error:", error);
      toast.dismiss();
      toast.error("प्रिंट जनरेट करने में समस्या आई");
    }
  };

  const addComplainant = () => {
    const newComplainant = {
      id: complainants.length + 1,
      name: '',
      fatherName: '',
      occupation: '',
      isPublicServant: 'चुनें',
        isMain: 0, 
    };
    setComplainants([...complainants, newComplainant]);
    setShowComplainants({ ...showComplainants, [newComplainant.id]: true });
  };

  const removeComplainant = (id) => {
    if (complainants.length > 1) {
      setComplainants(complainants.filter(c => c.id !== id));
      const newShowComplainants = { ...showComplainants };
      delete newShowComplainants[id];
      setShowComplainants(newShowComplainants);
    }
  };

  const updateComplainant = (id, field, value) => {
    setComplainants(complainants.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const toggleComplainant = (id) => {
    setShowComplainants({
      ...showComplainants,
      [id]: !showComplainants[id]
    });
  };

  const addPerson = () => {
    const newPerson = {
      id: persons.length + 1,
      name: '',
      designation: '',
      currentAddress: '',
      district: '',
      departmentNature: '',
      officerCategory: '',
        isMain: 0,
    };
    setPersons([...persons, newPerson]);
    setShowPersons({ ...showPersons, [newPerson.id]: true });
  };

  const removePerson = (id) => {
    if (persons.length > 1) {
      setPersons(persons.filter(p => p.id !== id));
      const newShowPersons = { ...showPersons };
      delete newShowPersons[id];
      setShowPersons(newShowPersons);
    }
  };

  const updatePerson = (id, field, value) => {
    setPersons(persons.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const togglePerson = (id) => {
    setShowPersons({
      ...showPersons,
      [id]: !showPersons[id]
    });
  };

 const handleFileChange = (fieldName, file) => {
  if (file && file.type !== "application/pdf") {
    toast.error("Please upload a PDF file only.");
    return;
  }

  setFormData({ ...formData, [fieldName]: file });

  if (errors[fieldName] || (fieldName === 'attachedDocumentsFile' && errors.attached_documents)) {
    const newErrors = { ...errors };
    delete newErrors[fieldName];
    if (fieldName === 'attachedDocumentsFile') delete newErrors.attached_documents;
    setErrors(newErrors);
  }
};

  const handleFormDataChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    complainants.forEach((complainant, index) => {
      if (!complainant.name.trim()) {
        newErrors.complainant_name = [`परिवादी ${index + 1} का नाम आवश्यक है।`];
      }
      if (!complainant.fatherName.trim()) {
        newErrors.father_name = [`परिवादी ${index + 1} के पिता का नाम आवश्यक है।`];
      }
      if (!complainant.occupation.trim()) {
        newErrors.occupation = [`परिवादी ${index + 1} का व्यवसाय आवश्यक है।`];
      }
      if (complainant.isPublicServant === 'चुनें') {
        newErrors.is_public_servant = [`परिवादी ${index + 1} के लिए लोक सेवक स्थिति चुनें।`];
      }
    });

    {/* if (!formData.relation.trim()) {
      newErrors.relation_with_person = ['संबंध का विवरण आवश्यक है।'];
    }

    if (!formData.authorizationFile || formData.authorizationFile.length === 0) {
      newErrors.authorization_document = ['प्राधिकरण दस्तावेज़ अपलोड करना आवश्यक है।'];
    } */}

    // Removed validation for permanent_name as there is no input field for it
    {/* if (!formData.permanentAddress.place.trim()) {
      newErrors.permanent_place = ['स्थायी पते का स्थान आवश्यक है।'];
    }
    if (!formData.permanentAddress.postOffice.trim()) {
      newErrors.permanent_post_office = ['डाकघर/पुलिस थाना आवश्यक है।'];
    }
    if (!formData.permanentAddress.district.trim()) {
      newErrors.permanent_district = ['जिला आवश्यक है।'];
    } */}

    

    if (!formData.correspondenceAddress.name.trim()) {
      newErrors.correspondence_name = ['पत्राचार पते का नाम आवश्यक है।'];
    }
    if (!formData.correspondenceAddress.place.trim()) {
      newErrors.correspondence_place = ['पत्राचार पते का स्थान आवश्यक है।'];
    }
    if (!formData.correspondenceAddress.postOffice.trim()) {
      newErrors.correspondence_post_office = ['डाकघर/पुलिस थाना आवश्यक है।'];
    }
    if (!formData.correspondenceAddress.district.trim()) {
      newErrors.correspondence_district = ['जिला आवश्यक है।'];
    }

    // ✅ Section 6 Validation (ONLY name + designation)
persons.forEach((p, index) => {
  if (!p.name) {
    newErrors.person_name = `व्यक्ति ${index + 1} का नाम आवश्यक है`;
  }

  if (!p.designation) {
    newErrors.person_designation = `व्यक्ति ${index + 1} का पदनाम आवश्यक है`;
  }
});



    if (!formData.complaintDate) {
      newErrors.cause_date = ['शिकायत की तिथि आवश्यक है।'];
    }
    if (!formData.delayReason.trim()) {
      newErrors.delay_reason = ['विलम्ब का कारण आवश्यक है।'];
    }

    if (!formData.previousComplaint) {
      newErrors.previously_submitted = ['कृपया पूर्व शिकायत का चयन करें (हाँ/नहीं)।'];
    }

    if (formData.previousComplaint === 'हाँ' && !formData.previousComplaintDetails.trim()) {
      newErrors.previously_submitted_details = ['यदि पहले प्रस्तुत किया है तो विवरण आवश्यक है।'];
    }



    // if (!formData.complaintType) {
    //   newErrors.category = ['शिकायत की श्रेणी चुनें (अभिकथन/शिकायत)।'];
    // }

    // --- Conditional Validation for Challan (Only if assertion) ---
    {/* if (formData.complaintType === 'अभिकथन') {
        if (!formData.challanNumber.trim()) {
        newErrors.challan_number = ['चालान संख्या आवश्यक है।'];
        }
        if (!formData.challanDate) {
        newErrors.challan_date = ['चालान की तिथि आवश्यक है।'];
        }
        if (!formData.challanFile) {
        newErrors.challan_file = ['चालान फाइल अपलोड करना आवश्यक है।'];
        }
    } */}

    // --- Validation for Supporting Persons (Array) ---
    // At least one person should be filled if required? Or if they add a row, it must be filled.
    // The previous validation was checking if string is empty.
    // Assuming at least one person is NOT mandatory if user deleted all rows, but if rows exist they must be valid?
    // User requirement: "List of persons who gave affidavit". Usually mandatory.
 

    if (!formData.attachedDocumentsFile) {
      newErrors.attached_documents = ['संलग्न दस्तावेजों की फाइल आवश्यक है।'];
    }

    if (!formData.complaintDescription.trim()) {
      newErrors.complaint_description = ['शिकायत का विवरण आवश्यक है।'];
    }

    return newErrors;
  };

  // const handlePreview = (e) => {


  //   e.preventDefault();

  //   const validationErrors = validateForm();

  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     toast.error('कृपया सभी आवश्यक फ़ील्ड भरें!', {
  //       position: "top-right",
  //       autoClose: 3000,
  //     });
  //     // window.scrollTo({ top: 0, behavior: 'smooth' });
  //     return;
  //   }

  //   setErrors({});
  //   setShowPreview(true);
  // };


    const handlePreview = (e) => {
    if (e) e.preventDefault();

    // 1. Validation Logic (Logic yahi likh diya taaki naye array ko check kare)
    const newErrors = {};

    // --- Check Complainants Array ---
    complainants.forEach((comp, index) => {
      // Basic Fields
      if (!comp.name) newErrors[`complainant_name`] = `Parivadi ${index+1}: Name missing`;
      if (!comp.fatherName) newErrors[`father_name`] = `Parivadi ${index+1}: Father Name missing`;
      if (!comp.occupation) newErrors[`occupation`] = `Parivadi ${index+1}: Occupation missing`;
      
      // ✅ Address Fields (Ab ye Array me check honge)
      {/* if (!comp.district) newErrors[`permanent_district`] = `Parivadi ${index+1}: District missing`; */}
      {/* if (!comp.postOffice) newErrors[`permanent_post_office`] = `Parivadi ${index+1}: Post Office missing`; */}
      {/* if (!comp.place) newErrors[`permanent_place`] = `Parivadi ${index+1}: Place missing`; */}
    });

    // --- Check Other Mandatory Fields ---
    {/* if (!formData.complaintDescription) {
      // newErrors.complaint_description = "Complaint Description is missing";
      newErrors.complaint_description = ["शिकायत का विवरण आवश्यक है।"];
    } */}

    // 2. Error Reporting (Console me dikhana)
    {/* if (Object.keys(newErrors).length > 0) {
      // 🛑 Console Group Start
      console.group("❌ PREVIEW BLOCKED - Validation Errors:");
      console.error("List of Errors:", newErrors);
      console.log("Current Complainants Data:", complainants); // Isse pata chalega data save hua ya nahi
      console.groupEnd();
      // 🛑 Console Group End

      setErrors(newErrors);
      toast.error('कृपया सभी आवश्यक फ़ील्ड भरें!', {
        position: "top-right",
        autoClose: 3000,
      });
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    } */}

    const handlePreview = (e) => {
  if (e) e.preventDefault();

  console.log("✅ Popup Open");

  setErrors({});
  setShowPreview(true);
};

    // 3. Success
    console.log("✅ Validation Passed! Opening Preview...");
    setErrors({});
    setShowPreview(true);
  };

  const resetAll = () => {
  setComplainants([
    {
      id: 1,
      name: '',
      fatherName: '',
      occupation: '',
      isPublicServant: 'चुनें',
      place: '',
      postOffice: '',
      district: '',
      isMain: 0,
    }
  ]);
  setPersons([
    {
      id: 1,
      name: '',
      designation: '',
      currentAddress: '',
      district: '',
      departmentNature: '',
      officerCategory: '',
      isMain: 0,
    }
  ]);
  setFormData({
    relation: '',
    authorizationFile: null,
    correspondenceAddress: {
      name: '',
      place: '',
      postOffice: '',
      district: '',
    },
    complaintDate: '',
    delayReason: '',
    previousComplaint: '',
    previousComplaintDetails: '',
    complaintType: '',
    challanNumber: '',
    challanDate: '',
    challanFile: null,
    supportingPersons: [{ name: '', address: '' }],
    otherPersons: [{ name: '', address: '' }],
    attachedDocuments: '',
    attachedDocumentsFile: null,
    complaintDescription: '',
  });
  setShowComplainants({ 1: true });
  setShowPersons({ 1: true });
  setErrors({});
};


  const handleSaveDraft = async () => {
  try {
    setDrfatLoader(true);
    setErrors({});

    const draftData = new FormData();

    // 1️⃣ Complainants
    complainants.forEach((c, index) => {
      draftData.append(`complainant_name[${index}]`, c.name || '');
      draftData.append(`father_name[${index}]`, c.fatherName || '');
      draftData.append(`occupation[${index}]`, c.occupation || '');
      draftData.append(`is_public_servant[${index}]`,
        c.isPublicServant === 'हाँ' ? 'yes' :
        c.isPublicServant === 'नहीं' ? 'no' : ''
      );

      draftData.append(`permanent_place[${index}]`, c.place || '');
      draftData.append(`permanent_post_office[${index}]`, c.postOffice || '');
      draftData.append(`permanent_district[${index}]`, c.district || '');
      draftData.append(`is_main_c[${index}]`, c.isMain ? 1 : 0);
    });

    // 2️⃣ Respondents
    persons.forEach((p, index) => {
      draftData.append(`respondent_name[${index}]`, p.name || '');
      draftData.append(`designation[${index}]`, p.designation || '');
      draftData.append(`current_address[${index}]`, p.currentAddress || '');
      draftData.append(`respondent_district[${index}]`, p.district || '');
      draftData.append(`department_name[${index}]`, p.departmentNature || '');
      draftData.append(`officer_category[${index}]`, p.officerCategory || '');
      draftData.append(`is_main_r[${index}]`, p.isMain ? 1 : 0);
    });

    // 3️⃣ Relation + Auth
    draftData.append('relation_with_person', formData.relation || '');
   if (formData.authorizationFile && formData.authorizationFile.length > 0) {
  formData.authorizationFile.forEach((file, index) => {
    draftData.append(`authorization_document[${index}]`, file);
  });
}

    // 4️⃣ Correspondence Address
    draftData.append('correspondence_name', formData.correspondenceAddress.name || '');
    draftData.append('correspondence_place', formData.correspondenceAddress.place || '');
    draftData.append('correspondence_post_office', formData.correspondenceAddress.postOffice || '');
    draftData.append('correspondence_district', formData.correspondenceAddress.district || '');

    // 5️⃣ Complaint Info
    draftData.append('cause_date', formData.complaintDate || '');
    draftData.append('delay_reason', formData.delayReason || '');

    const prev =
      formData.previousComplaint === 'हाँ' ? 'yes' :
      formData.previousComplaint === 'नहीं' ? 'no' : '';
    draftData.append('previously_submitted', prev);
    draftData.append('previously_submitted_details', formData.previousComplaintDetails || '');

    // 6️⃣ Category
    draftData.append(
      'category',
      formData.complaintType === 'अभिकथन'
        ? 'assertion'
        : formData.complaintType === 'शिकायत'
        ? 'complaint'
        : ''
    );

    // 7️⃣ Support Persons
    formData.supportingPersons?.forEach((p, i) => {
      draftData.append(`support_name[${i}]`, p.name || '');
      draftData.append(`support_address[${i}]`, p.address || '');
    });

    // 8️⃣ Witness
    formData.otherPersons?.forEach((p, i) => {
      draftData.append(`witness_name[${i}]`, p.name || '');
      draftData.append(`witness_address[${i}]`, p.address || '');
    });

    // 9️⃣ Documents
    draftData.append('attached_documents_description', formData.attachedDocuments || '');
    if (formData.attachedDocumentsFile) {
      draftData.append('attached_documents', formData.attachedDocumentsFile);
    }

    draftData.append('complaint_description', formData.complaintDescription || '');

    // 🔥 DRAFT API CALL
    await api.post('/operator/save-draft-complaint', draftData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    toast.success('ड्राफ्ट सफलतापूर्वक सेव हो गया ✅');

    setTimeout(()=>{
      navigate("/operator/draft")
    }, 2000)
    
    setShowPreview(false);
    resetAll()

  } catch (error) {
    console.error("Draft Error:", error);

    if (error.response?.data?.errors) {
      setErrors(error.response.data.errors);
      toast.error(error.response.data.message || 'ड्राफ्ट सेव नहीं हुआ');
    } else {
      toast.error('कुछ गलत हो गया');
    }
  } finally {
    setDrfatLoader(false);
  }
};


  const handleSubmit = async (e) => {
    // 1. Prevent Default Check
    if (e) e.preventDefault(); 
    
    setIsSubmitting(true);
    setErrors({})

    // --- VALIDATION START ---
    const newErrors = {};
    
    // Validate Complainants Array
    {/* complainants.forEach((comp, index) => {
      // Basic Fields
      if (!comp.name) newErrors[`complainant_name_${index}`] = "परिवादी का नाम अनिवार्य है";
      if (!comp.fatherName) newErrors[`father_name_${index}`] = "पिता का नाम अनिवार्य है";
      if (!comp.occupation) newErrors[`occupation_${index}`] = "व्यवसाय अनिवार्य है";
      
      // Address Fields (Ab ye array me hain)
      if (!comp.district) newErrors[`permanent_district_${index}`] = "जिला अनिवार्य है";
      if (!comp.postOffice) newErrors[`permanent_post_office_${index}`] = "डाकघर/थाना अनिवार्य है";
      if (!comp.place) newErrors[`permanent_place_${index}`] = "स्थान अनिवार्य है";
    }); */}

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      toast.error("कृपया सभी अनिवार्य फ़ील्ड भरें।", { position: "top-right" });
      return;
    }
    // --- VALIDATION END ---

    try {
      const submitData = new FormData();

      // 1. Complainants & Their Addresses (MERGED LOOP)
      complainants.forEach((complainant, index) => {
        // Personal Details
        submitData.append(`complainant_name[${index}]`, complainant.name || '');
        submitData.append(`father_name[${index}]`, complainant.fatherName || '');
        submitData.append(`occupation[${index}]`, complainant.occupation || '');
        submitData.append(`is_public_servant[${index}]`, complainant.isPublicServant === 'हाँ' ? 'yes' : 'no');
        submitData.append(`is_main_c[${index}]`, complainant.isMain ? 1 : 0);

        // ✅ FIXED: Address Fields ab Loop ke andar hain (Dynamic Index ke sath)
        // Note: permanent_name usually same as complainant name in this context
        {/* submitData.append(`permanent_name[${index}]`, complainant.name || '');  */}
        submitData.append(`permanent_name[${index}]`, complainant.permanentName || '');
        submitData.append(`permanent_place[${index}]`, complainant.place || '');
        submitData.append(`permanent_post_office[${index}]`, complainant.postOffice || '');
        submitData.append(`permanent_district[${index}]`, complainant.district || '');
      });

      // 2. Respondents (Persons)
      persons.forEach((person, index) => {
        submitData.append(`respondent_name[${index}]`, person.name || '');
        submitData.append(`designation[${index}]`, person.designation || '');
        submitData.append(`current_address[${index}]`, person.currentAddress || '');
        submitData.append(`respondent_district[${index}]`, person.district || '');
        submitData.append(`department_name[${index}]`, person.departmentNature || '');
        submitData.append(`officer_category[${index}]`, person.officerCategory || '');
        submitData.append(`is_main_r[${index}]`, person.isMain ? 1 : 0);
      });

      // 3. Relation & Auth
      complainants.forEach((c, index) => {
        submitData.append(`relation_with_person[${index}]`, c.relation || '');
      });
      {/* if (formData.authorizationFile && formData.authorizationFile.length > 0) {
  formData.authorizationFile.forEach((file, index) => {
    submitData.append(`authorization_document[${index}]`, file);
  });
} */}

complainants.forEach((c, index) => {
  if (c.authorizationFile) {
    submitData.append(`authorization_document[${index}]`, c.authorizationFile);
  }
});

      // 4. Correspondence Address (Ye abhi bhi global formData se aa raha hai - agar UI me alag hai)
      submitData.append('correspondence_name', formData.correspondenceAddress.name || '');
      submitData.append('correspondence_place', formData.correspondenceAddress.place || '');
      submitData.append('correspondence_post_office', formData.correspondenceAddress.postOffice || '');
      submitData.append('correspondence_district', formData.correspondenceAddress.district || '');

      // 5. Complaint Details
      submitData.append('cause_date', formData.complaintDate || '');
      submitData.append('delay_reason', formData.delayReason || '');
      
      const prevVal = formData.previousComplaint === 'हाँ' ? 'yes' : formData.previousComplaint === 'नहीं' ? 'no' : '';
      submitData.append('previously_submitted', prevVal);
      if (prevVal === 'yes') {
        submitData.append('previously_submitted_details', formData.previousComplaintDetails || '');
      }

      // 6. Category
      const categoryVal = formData.complaintType === 'अभिकथन' ? 'assertion' : formData.complaintType === 'शिकायत' ? 'complaint' : '';
      submitData.append('category', categoryVal);

      // 7. Challan
      if (formData.complaintType === 'अभिकथन') {
        submitData.append('challan_number', formData.challanNumber || '');
        submitData.append('challan_date', formData.challanDate || '');
        if (formData.challanFile) {
            submitData.append('challan_file', formData.challanFile);
        }
      }

      // 8. Support Persons (Loop Fixed)
      if (Array.isArray(formData.supportingPersons)) {
        formData.supportingPersons.forEach((p, i) => {
            submitData.append(`support_name[${i}]`, p.name || '');
            submitData.append(`support_address[${i}]`, p.address || '');
        });
      }

      // 9. Other Witnesses (Loop Fixed)
      if (Array.isArray(formData.otherPersons)) {
         formData.otherPersons.forEach((p, i) => {
            submitData.append(`witness_name[${i}]`, p.name || '');
            submitData.append(`witness_address[${i}]`, p.address || '');
         });
      }

      // 10. Documents & Description
      if (formData.attachedDocumentsFile) {
        submitData.append('attached_documents', formData.attachedDocumentsFile);
      }
      submitData.append('attached_documents_description', formData.attachedDocuments || '');
      submitData.append('complaint_description', formData.complaintDescription || '');


      // API Call
      await api.post('/operator/add-complaint', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('शिकायत सफलतापूर्वक सबमिट हो गई है!', {
        position: "top-right",
        autoClose: 3000,
      });

       setTimeout(()=>{
      navigate("/operator/all-complaints")
    }, 2000)

      
      setShowPreview(false);
      handleReset();

    } catch (error) {
      console.error("Submission Error:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
        setShowPreview(false);
        toast.error(error.response.data.message || 'कृपया त्रुटियों को ठीक करें।', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error('कुछ गलत हो गया। कृपया पुनः प्रयास करें।', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setComplainants([{
      id: 1,
      name: '',
      fatherName: '',
      occupation: '',
      isPublicServant: 'चुनें',
       isMain: 0,
    }]);
    setPersons([{
      id: 1,
      name: '',
      designation: '',
      currentAddress: '',
      district: '',
      departmentNature: '',
      officerCategory: '',
       isMain: 0,
    }]);
    setFormData({
      relation: '',
      authorizationFile: null,
      permanentAddress: { name: '', place: '', postOffice: '', district: '' },
      correspondenceAddress: { name: '', place: '', postOffice: '', district: '' },
      complaintDate: '',
      delayReason: '',
      previousComplaint: '',
      previousComplaintDetails: '',
      complaintType: '',
      challanNumber: '',
      challanDate: '',
      challanFile: null,
      supportingPersons: [{ name: '', address: '' }], // Reset to array
      otherPersons: [{ name: '', address: '' }], 
      attachedDocuments: '',
      attachedDocumentsFile: null,
      complaintDescription: ''
    });
    setShowComplainants({ 1: true });
    setShowPersons({ 1: true });
    setErrors({});
  };

  const handleSelect = (value) => {
  if (formData.complaintType === value) {
    handleFormDataChange("complaintType", "");   
  } else {
    handleFormDataChange("complaintType", value); 
  }
};


  return (
    <div className="min-h-screen bg-white rounded-md py-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto">
        {/* Form Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
            {/* "शिकायत", "अभिकथन" उत्तर प्रदेश लोक आयुक्त तथा माननीय उप लोक आयुक्त अधिनियम, 1975 */}
            "शिकायत", "अभिकथन" उत्तर प्रदेश लोक आयुक्त तथा उप लोक आयुक्त अधिनियम, 1975 की
          </h1>

          <p className="text-gray-600 text-center text-base mb-3">
            {/* धारा 2 (ख) और (घ) में यथापरिभाषित, संबंधी परिवाद का प्रपत्र जो लोक आयुक्त / माननीय उप लोक आयुक्त को दिया जायेगा। */}
            धारा 2 (ख) और (घ) में यथापरिभाषित, संबंधी परिवाद का प्रपत्र जो लोक आयुक्त / उप लोक आयुक्त को दिया जायेगा।
          </p>
        </div>

        <form onSubmit={handlePreview}>
          {/* 1. Complainants */}
<div className="bg-white rounded-lg shadow-md p-6 mb-6">
  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-3 md:mb-0">
      1. परिवादी का विवरण:
    </h3>
    <button
      type="button"
      className="bg-white text-[12px] text-orange-500 border-2 border-orange-500 hover:bg-orange-500 hover:text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap"
      onClick={addComplainant}
    >
      + अन्य परिवादी जोड़ें
    </button>
  </div>

  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
    प्रत्येक कार्ड एक परिवादी के लिए है। आवश्यकता अनुसार अतिरिक्त परिवादी जोड़े जा सकते हैं।
  </p>

  {/* 🔥 ONE SINGLE MAP FUNCTION FOR EVERYTHING */}
  {complainants.map((complainant, index) => (
    <div key={complainant.id} className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      
      {/* 🟢 Accordion Header */}
      <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-b border-gray-200">
        <h4 className="text-base font-medium text-gray-700">परिवादी {index + 1}</h4>
        <div className="flex gap-2">
          {complainants.length > 1 && (
            <button
              type="button"
              className="text-red-600 hover:bg-red-50 border border-red-600 px-3 py-1 rounded text-sm transition-all duration-200"
              onClick={() => removeComplainant(complainant.id)}
            >
              हटाएँ
            </button>
          )}
          <button
            type="button"
            className="bg-white hover:bg-gray-100 border border-gray-300 px-3 py-1 rounded text-lg font-bold transition-all duration-200 min-w-[35px]"
            onClick={() => toggleComplainant(complainant.id)}
          >
            {showComplainants[complainant.id] ? '−' : '+'}
          </button>
        </div>
      </div>

      {/* 🟢 Accordion Body */}
      {showComplainants[complainant.id] && (
        <div className="p-5 animate-slideDown">
          
          {/* Section 1 & 2: Name and Father Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                1. परिवादी का नाम <span className="text-red-500">*</span>
              </label>
              <input
                type="text" 
                placeholder='परिवादी का नाम दर्ज करें' 
                style={{ height: "48px" }} 
                className={`kruti-input w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 placeholder:text-xs ${
                  errors.complainant_name ? 'border-red-500' : 'border-gray-300'
                }`}
                value={complainant.name || ''}
                onChange={(e) => updateComplainant(complainant.id, 'name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                2. पिता या पति का नाम <span className="text-red-500">*</span>
              </label>
              <input
                type="text" 
                placeholder='पिता का नाम दर्ज करें' 
                style={{ height: "48px" }} 
                className={`kruti-input w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 placeholder:text-xs ${
                  errors.father_name ? 'border-red-500' : 'border-gray-300'
                }`}
                value={complainant.fatherName || ''}
                onChange={(e) => updateComplainant(complainant.id, 'fatherName', e.target.value)}
              />
            </div>
          </div>

          {/* Section 3: Occupation and Public Servant */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                3.(क) व्यवसाय  <span className="text-red-500">*</span>
              </label>
              <input
                type="text" 
                placeholder='व्यवसाय का प्रकार दर्ज करें'
                style={{ height: "48px" }} 
                className={`kruti-input w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 placeholder:text-xs ${
                  errors.occupation ? 'border-red-500' : 'border-gray-300'
                }`}
                value={complainant.occupation || ''}
                onChange={(e) => updateComplainant(complainant.id, 'occupation', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                (ख) क्या आप लोक सेवक हैं या नहीं  <span className="text-red-500">*</span>
              </label>
              <select
                style={{ height: "48px" }} 
                className={`w-full px-4 border bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200  ${
                  errors.is_public_servant ? 'border-red-500' : 'border-gray-300'
                }`}
                value={complainant.isPublicServant || ''}
                onChange={(e) => updateComplainant(complainant.id, 'isPublicServant', e.target.value)}
              >
                <option value="चुनें">चुनें</option>
                <option value="हाँ">हाँ</option>
                <option value="नहीं">नहीं</option>
              </select>
            </div>
          </div>

          {/* Section 3(ग): Relation & Document */}
          <div className="bg-white mb-6">
            <h3 className="text-sm text-gray-800 mb-4">
              (ग). यदि परिवाद किसी अन्य व्यक्ति की ओर से है तो उस व्यक्ति के साथ अपना संबंध बताएं। यह साबित करने के लिए कि आप उसकी सम्पदा का प्रतिनिधित्व करते हैं या उसने इस निमित्त आपको प्राधिकृत किया है, दस्तावेज़ भी यदि कोई हो, संलग्न करें। 
            </h3>
            <textarea
              placeholder="संबंध का विवरण लिखें"
              rows="3"
              className={`kruti-input w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 resize-y placeholder:text-base ${
                errors.relation_with_person ? 'border-red-500' : 'border-gray-300'
              }`}
              value={complainant.relation}
              onChange={(e) =>
                updateComplainant(complainant.id, 'relation', e.target.value)
              }
            />
            {errors.relation_with_person && (
              <p className="text-red-500 text-sm mt-1">{errors.relation_with_person[0]}</p>
            )}
            
            {/* <p className="text-gray-600 text-xs mt-3 leading-relaxed">
              यह साबित करने के लिए कि आप उसकी सम्पदा का प्रतिनिधित्व करते हैं या उसने इस निमित्त आपको प्राधिकृत किया है, संबंधित दस्तावेज संलग्न करें।
            </p> */}
            
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-4">
              <label
                className={`bg-orange-50 text-orange-600 font-semibold px-4 py-2 border border-orange-200 rounded-lg cursor-pointer hover:bg-orange-100 transition-all duration-200 ${
                  errors.authorization_document ? 'border-red-500 text-red-600' : ''
                }`}
              >
                Choose File
                <input
                  type="file"
                  className="hidden"
                  // onChange={(e) => handleFileChange('authorizationFile', e.target.files[0])}
                  // onChange={(e) => handleFileChange('authorizationFile', [...e.target.files])}
                  onChange={(e) =>
  updateComplainant(
    complainant.id,
    'authorizationFile',
    e.target.files[0]
  )
}
                  accept=".pdf"
                />
              </label>
              <span className="text-gray-500 text-sm truncate">
         {complainant.authorizationFile
  ? complainant.authorizationFile.name
  : "No file chosen"}
              </span>
            </div>
            {errors.authorization_document && (
              <p className="text-red-500 text-sm mt-1">{errors.authorization_document[0]}</p>
            )}
          </div>

          {/* 🔥 Section 4: स्थायी पता (NOW MOVED INSIDE THE CARD) 🔥 */}
          <div className="mt-2 pt-5 border-t border-gray-200">
            <h3 className="text-base font-semibold text-gray-800 mb-4">
              4. स्थायी पता :
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* (क) Name (For Address) */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (क) नाम 
                </label>
                <input
                  type="text"
                  placeholder="uke" // Kruti Dev placeholder
                  style={{ height: "48px" }}
                  className="kruti-input w-full px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={complainant.permanentName || ''} // CHANGED to permanentName to separate from main name
                  onChange={(e) =>
                    updateComplainant(complainant.id, 'permanentName', e.target.value)
                  }
                />
              </div>

              {/* (ख) Place */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (ख) स्थान 
                </label>
                <input
                  type="text"
                  placeholder="LFkku dk uke" // Kruti Dev placeholder
                  style={{ height: "48px" }}
                  className="kruti-input w-full px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={complainant.place || ''}
                  onChange={(e) =>
                    updateComplainant(complainant.id, 'place', e.target.value)
                  }
                />
              </div>

              {/* (ग) Post Office */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (ग) डाकघर या पुलिस थाना 
                </label>
                <input
                  type="text"
                  placeholder="MkWd?k;kZ @ iqfyl Fkkuk" // Kruti Dev placeholder
                  style={{ height: "48px" }}
                  className="kruti-input w-full px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={complainant.postOffice || ''}
                  onChange={(e) =>
                    updateComplainant(complainant.id, 'postOffice', e.target.value)
                  }
                />
              </div>

              {/* (घ) District */}
              <div>
  <label className="block text-gray-700 text-sm font-medium mb-2">
    (घ) जिला 
  </label>
  <select
    // यहाँ से डायनामिक फॉन्ट हटा दिया है और परमानेंट KrutiDev स्टाइल लगा दिया है
    style={{ height: "48px", fontFamily: 'KrutiDev', fontSize: '20px' }}
    className="w-full px-4 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 kruti-input"
    value={complainant.district || ''}
    onChange={(e) =>
      updateComplainant(complainant.id, 'district', e.target.value)
    }
  >
    {/* KrutiDev के हिसाब से 'ज़िला चुनें' */}
    <option value="">
      -- ftyk pqusa --
    </option>
    
    {districtList.map((dist, i) => (
      <option key={i} value={dist.district_code}>
        {/* सिर्फ KrutiDev वाला डेटा रखेंगे, dist.dist_name_hi हटा दिया */}
        {dist.district_name}
      </option>
    ))}
  </select>
</div>
            </div>
          </div>

          {/* Main Complainant Selection Toggle */}
          <div className="w-full mt-6">
            <div
              onClick={() => handleMainComplainant(complainant.id)}
              className={`flex items-center p-3 border rounded-lg transition-all duration-200 cursor-pointer ${
                complainant.isMain
                  ? "bg-orange-50 border-orange-500 ring-1 ring-orange-500"
                  : "bg-gray-50 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center pl-2">
                <input
                  type="checkbox"
                  checked={complainant.isMain === 1}
                  onChange={() => {}}
                  className="accent-orange-500 pointer-events-none w-4 h-4" 
                />
              </div>
              <div className="ml-3 text-sm select-none">
                <label className="font-medium text-gray-900 cursor-pointer pointer-events-none">
                  मुख्य परिवादी (Main Complainant)
                </label>
              </div>
            </div>
            {errors.is_main_c && (
              <p className="text-red-500 text-sm mt-1">{errors.is_main_c[0]}</p>
            )}
          </div>

        </div>
      )}
    </div>
  ))}
</div>
        

          {/* 3. Correspondence Address */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              5. पता जिस पर सूचना भेजी जाये : 
              {/* <span className="text-red-500">*</span> */}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (क) नाम 
                  {/* <span className="text-red-500">*</span> */}
                </label>
                <input
                  type="text" placeholder='नाम दर्ज करें'
                                    style={{ height: "48px" }} 

                  className={` kruti-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder:text-xs ${
                    errors.correspondence_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.correspondenceAddress.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      correspondenceAddress: { ...formData.correspondenceAddress, name: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (ख) स्थान 
                </label>
                <input
                  type="text" placeholder='स्थान दर्ज करें'
                                    style={{ height: "48px" }} 

                  className={` kruti-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder:text-xs ${
                    errors.correspondence_place ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.correspondenceAddress.place}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      correspondenceAddress: { ...formData.correspondenceAddress, place: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  (ग) डाकघर या पुलिस थाना 
                </label>
                <input
                  type="text" placeholder='संबंधित डाकघर पुलिस थाना का नाम'
                                    style={{ height: "48px" }} 

                  className={  `kruti-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder:text-xs ${
                    errors.correspondence_post_office ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={formData.correspondenceAddress.postOffice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      correspondenceAddress: { ...formData.correspondenceAddress, postOffice: e.target.value },
                    })
                  }
                />
              </div>
              {/* UPDATED: District as Dropdown */}
           <div>
  <label className="block text-gray-700 text-sm font-medium mb-2">
    (घ) जिला 
  </label>

  <select
    // यहाँ से डायनामिक फॉन्ट कंडीशन हटा दी है और परमानेंट kruti-input लगा दिया है 
    // एरर वाला लाल/ग्रे बॉर्डर का लॉजिक वैसे ही रहेगा
    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white kruti-input ${
      errors.correspondence_district ? 'border-red-500' : 'border-gray-300'
    }`}
    style={{ fontFamily: 'KrutiDev', fontSize: '20px' }}
    value={formData.correspondenceAddress.district || ''}
    onChange={(e) =>
      setFormData({
        ...formData,
        correspondenceAddress: {
          ...formData.correspondenceAddress,
          district: e.target.value,
        },
      })
    }
  >
    {/* KrutiDev के हिसाब से 'ज़िला चुनें' */}
    <option value="">-- ftyk pqusa --</option>
    
    {districtList.map((dist, i) => (
      <option key={i} value={dist.district_code}>
        {/* सिर्फ KrutiDev वाला डेटा रखेंगे */}
        {dist.district_name}
      </option>
    ))}
  </select>
</div>
            </div>
          </div>

          {/* 4. Persons / Respondents */}
         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
    <h3 className="text-lg font-semibold text-gray-800 mb-3 md:mb-0">
      6. जिस व्यक्ति के विरुद्ध परिवाद किया जा रहा है उसका नाम, पदनाम (जो मामले के विषय में परिवाद किये जाने के समय पर रहा हो) और वर्तमान पता (यदि ज्ञात हो) :
    </h3>
    <button
      type="button"
      className="bg-white text-[12px] text-orange-500 border-2 border-orange-500 hover:bg-orange-500 hover:text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap"
      onClick={addPerson}
    >
      + अन्य व्यक्ति जोड़ें
    </button>
  </div>

  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
    (1) नाम, पदनाम जो मामले के विषय में परिवाद किये जाने के समय पर रहा हो और वर्तमान पता (यदि ज्ञात हो)
  </p>

  {errors.respondent_name && (
    <p className="text-red-500 text-sm mb-2">{errors.respondent_name[0]}</p>
  )}

  {persons.map((person, index) => (
    <div key={person.id} className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-b border-gray-200">
        <h4 className="text-base font-medium text-gray-700">व्यक्ति {index + 1}</h4>
        <div className="flex gap-2">
          {persons.length > 1 && (
            <button
              type="button"
              className="text-red-600 hover:bg-red-50 border border-red-600 px-3 py-1 rounded text-sm transition-all duration-200"
              onClick={() => removePerson(person.id)}
            >
              हटाएँ
            </button>
          )}
          <button
            type="button"
            className="bg-white hover:bg-gray-100 border border-gray-300 px-3 py-1 rounded text-lg font-bold transition-all duration-200 min-w-[35px]"
            onClick={() => togglePerson(person.id)}
          >
            {showPersons[person.id] ? '−' : '+'}
          </button>
        </div>
      </div>

      {showPersons[person.id] && (
        <div className="p-5 animate-slideDown">
   
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
<div>
  <label className="block text-gray-700 text-sm font-medium mb-2">
    ज़िला:
  </label>

  <select
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white kruti-input"
    style={{ fontFamily: 'KrutiDev', fontSize: '20px' }} // हमेशा KrutiDev रहेगा
    value={person.district || ''} 
    onChange={(e) => updatePerson(person.id, 'district', e.target.value)}
  >
    {/* KrutiDev में 'ज़िला चुनें' को ऐसे लिखते हैं */}
    <option value="">-- ftyk pqusa --</option>
    
    {districtList.map((dist, i) => (
      <option key={i} value={dist.district_code}>
        {dist.district_name}
      </option>
    ))}
  </select>
</div>
<div>
  <label className="block text-gray-700 text-sm font-medium mb-2">
    विभाग का नाम:
  </label>

  <select
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white kruti-input"
    // ज़िले की तरह इसमें भी हमेशा KrutiDev लगा रहेगा
    style={{ fontFamily: 'KrutiDev', fontSize: '20px' }} 
    value={person.departmentNature || ''}
    onChange={(e) => updatePerson(person.id, 'departmentNature', e.target.value)}
  >
    {/* KrutiDev में 'विभाग चुनें' को ऐसे लिखते हैं */}
    <option value="">-- foHkkx pqusa --</option>
    
    {departmentList.map((dept, i) => (
      <option key={i} value={dept.name}>
        {dept.name} {/* सिर्फ इंग्लिश वाला डेटा दिखाएं, KrutiDev इसे अपने आप हिंदी बना देगा */}
      </option>
    ))}
  </select>
</div>
          </div>

     
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                श्रेणी: 
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
                value={person.officerCategory || ''}
                onChange={(e) => updatePerson(person.id, 'officerCategory', e.target.value)}
              >
                <option value="">श्रेणी चुनें</option>
                {subjectList.map((subj, i) => (
                  <option key={i} value={subj.name}>
                    {subj.name} / {subj.name_h}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                पदनाम: 
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
                value={person.designation || ''}
                onChange={(e) => updatePerson(person.id, 'designation', e.target.value)}
              >
                <option value="">पदनाम चुनें</option>
                {designationList.map((desig, i) => (
                  <option key={i} value={desig.name}>
                    {desig.name} / {desig.name_h}
                  </option>
                ))}
              </select>
            </div>
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

  {/* श्रेणी */}
  <div>
    <label className="block text-gray-700 text-sm font-medium mb-2">
      श्रेणी:
    </label>
    <select
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white kruti-input"
      style={{ fontFamily: 'KrutiDev', fontSize: '20px' }}
      value={person.officerCategory || ''}
      onChange={(e) => updatePerson(person.id, 'officerCategory', e.target.value)}
    >
      <option value="">-- Js.kh pqusa --</option>

      {subjectList.map((subj, i) => {
        const value = subj.name_h || subj.name; // 🔥 fallback
        return (
          <option key={i} value={value}>
            {value}
          </option>
        );
      })}
    </select>
  </div>

  {/* पदनाम */}
{/* श्रेणी (Category) सेलेक्ट होने के बाद ही 'पदनाम' दिखेगा (By default hide) */}
{/* पदनाम का पूरा सेक्शन (Label + Input) सिर्फ 'अन्य' या 'Others' चुनने पर ही दिखेगा */}
{(person.officerCategory === 'vU;' || person.officerCategory === 'Others') && (
  <div>
    <label className="block text-gray-700 text-sm font-medium mb-2">
      पदनाम:
    </label>
    <input
      type="text"
      placeholder="inuke ntZ djsa" // KrutiDev placeholder for "पदनाम दर्ज करें"
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white kruti-input"
      style={{ fontFamily: 'KrutiDev', fontSize: '20px', height: "48px" }}
      value={person.designation || ''}
      onChange={(e) => updatePerson(person.id, 'designation', e.target.value)}
    />
  </div>
)}
</div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
            नाम: 
            </label>
            <input
              type="text" placeholder='अधिकारी का नाम दर्ज करें'
                                style={{ height: "48px" }} 

              className=" kruti-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-xs duration-200"
              value={person.name || ''}
              onChange={(e) => updatePerson(person.id, 'name', e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
            वर्तमान पता (यदि ज्ञात हो): 
            </label>
            <textarea placeholder='वर्तमान पता दर्ज करें'
              rows="3"
              className=" kruti-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y placeholder:text-xs "
              value={person.currentAddress || ''}
              onChange={(e) => updatePerson(person.id, 'currentAddress', e.target.value)}
            />
          </div>




          {/* <div className="mb-2">
             <div 
               className={`flex items-center p-4 border rounded-lg transition-all duration-200 cursor-pointer ${
                 person.isMain 
                   ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500' 
                   : 'bg-white border-gray-300 hover:bg-gray-50'
               }`}
            
             >
              <div className="relative flex items-center justify-center">
<label
  className={`flex items-center p-4  rounded-lg cursor-pointer transition-all duration-200
    ${person.isMain === 1
      ? ''
      : ''}
  `}
>
  <input
    type="checkbox"
    checked={person.isMain === 1}
    onChange={() => handleMainRespondent(person.id)}
    className="accent-orange-500"
  />

</label>

              </div>
              <div className="ml-3 text-sm select-none">
                <label className="font-medium text-gray-900 cursor-pointer">
                  मुख्य उत्तरदाता (Main Respondent)
                </label>
                <p className="text-gray-500 text-xs mt-0.5">
                  क्या यह मुख्य व्यक्ति/अधिकारी है जिसके विरुद्ध शिकायत है?
                </p>
              </div>
            </div>
            {errors.is_main_r && (
    <p className="text-red-500 text-sm mt-1">
      {errors.is_main_r[0]}
    </p>
  )}
          </div> */}

             <div className="mb-2">
  <div
    onClick={() => handleMainRespondent(person.id)}
    className={`flex items-center p-4 border rounded-lg transition-all duration-200 cursor-pointer ${
      person.isMain
        ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500'
        : 'bg-white border-gray-300 hover:bg-gray-50'
    }`}
  >
    <div className="relative flex items-center justify-center">
      <div className="flex items-center p-4 rounded-lg transition-all duration-200">
        <input
          type="checkbox"
          checked={person.isMain === 1}
          onChange={() => {}}
          className="accent-orange-500 pointer-events-none"
        />
      </div>
    </div>
    <div className="ml-3 text-sm select-none">
      <label className="font-medium text-gray-900 cursor-pointer pointer-events-none">
        मुख्य उत्तरदाता (Main Respondent)
      </label>
      <p className="text-gray-500 text-xs mt-0.5 pointer-events-none">
        क्या यह मुख्य व्यक्ति/अधिकारी है जिसके विरुद्ध शिकायत है?
      </p>
    </div>
  </div>
  {errors.is_main_r && (
    <p className="text-red-500 text-sm mt-1">
      {errors.is_main_r[0]}
    </p>
  )}
</div>

          {/* --- END NEW SECTION --- */}

        </div>
      )}
    </div>
  ))}

  {/* Rest of the form (Date, Delay Reason, Previous Complaint) - UNTOUCHED */}
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2">
      (2) दिनांक जब परिवाद का कारण उत्पन्न हुआ हो। :
    </label>
    <input
      type="date"
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
        errors.cause_date ? 'border-red-500' : 'border-gray-300'
      }`}
      value={formData.complaintDate}
      onChange={(e) => handleFormDataChange('complaintDate', e.target.value)}
    />
    {errors.cause_date && (
      <p className="text-red-500 text-sm mt-1">{errors.cause_date[0]}</p>
    )}
  </div>

  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-medium mb-2">
      (3) परिवाद विलम्ब से प्रस्तुत करने का कारण, यदि परिवाद धारा 8 की उपधारा (4) के अधीन समय व्यतीत हो जाने पर किया गया हो : 
    </label>
    <textarea placeholder='विलम्ब का कारण दर्ज करें'
      rows="4"
      className={` kruti-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y placeholder:text-xs ${
        errors.delay_reason ? 'border-red-500' : 'border-gray-300'
      }`}
      value={formData.delayReason}
      onChange={(e) => handleFormDataChange('delayReason', e.target.value)}
    />
    {errors.delay_reason && (
      <p className="text-red-500 text-sm mt-1">{errors.delay_reason[0]}</p>
    )}
  </div>

  <div>
    <label className="block text-gray-700 text-sm font-medium mb-3">
      (4) क्या परिवाद पहले किसी वरिष्ठ अधिकारी के समक्ष किया गया था? या किसी अधिकरण या न्यायालय के समक्ष कार्यवाही की गई थी, यदि हाँ, तो उसका क्या परिणाम निकला, यदि नहीं, कृपया संक्षेप में कारण बतायें? 
    </label>
    <div className="flex gap-6 mb-3">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="previousComplaint"
          value="हाँ"
          className="w-4 h-4 text-orange-500 focus:ring-orange-500"
          checked={formData.previousComplaint === 'हाँ'}
          onChange={(e) => handleFormDataChange('previousComplaint', e.target.value)}
        />
        <span className="text-gray-700">हाँ</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="previousComplaint"
          value="नहीं"
          className="w-4 h-4 text-orange-500 focus:ring-orange-500"
          checked={formData.previousComplaint === 'नहीं'}
          onChange={(e) => handleFormDataChange('previousComplaint', e.target.value)}
        />
        <span className="text-gray-700">नहीं</span>
      </label>
    </div>
    {errors.previously_submitted && (
      <p className="text-red-500 text-sm mb-2">{errors.previously_submitted[0]}</p>
    )}
    {errors.previously_submitted_details && (
      <p className="text-red-500 text-sm mb-2">{errors.previously_submitted_details[0]}</p>
    )}
    {formData.previousComplaint === 'हाँ' && (
      <textarea
        placeholder="यदि हाँ तो परिणाम  स्थिति तथा यदि नहीं तो संक्षेप में कारण लिखें।"
        rows="4"
        // className=" kruti-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y"
        className="kruti-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y placeholder:text-sm"
        value={formData.previousComplaintDetails}
        onChange={(e) => handleFormDataChange('previousComplaintDetails', e.target.value)}
      />
      
    )}
  </div>
</div>



<div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-slideDown">

  {/* 🔥 Heading */}
  <h3 className="text-lg font-semibold text-gray-800 mb-4">
    7. क्या यह,
    (क) कोई अभिकथन अधिनियम की धारा 2 (ख) में यथा परिभाषित है? या 
    (ख) शिकायत अधिनियम की धारा 2 (घ) में यथा परिभाषित है।
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* अभिकथन */}
    <div
      onClick={() => handleSelect("अभिकथन")}
      className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer 
        ${formData.complaintType === "अभिकथन"
          ? "border-orange-500 bg-orange-50"
          : "border-gray-300 hover:bg-gray-50"}`}
    >
      <div
        className={`w-4 h-4 mt-1 rounded-full border 
          ${formData.complaintType === "अभिकथन"
            ? "bg-orange-500 border-orange-500"
            : "border-gray-400"}`}
      ></div>

      <span className="text-gray-700">
        (क) अभिकथन
      </span>
    </div>

    {/* शिकायत */}
    <div
      onClick={() => handleSelect("शिकायत")}
      className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer 
        ${formData.complaintType === "शिकायत"
          ? "border-orange-500 bg-orange-50"
          : "border-gray-300 hover:bg-gray-50"}`}
    >
      <div
        className={`w-4 h-4 mt-1 rounded-full border 
          ${formData.complaintType === "शिकायत"
            ? "bg-orange-500 border-orange-500"
            : "border-gray-400"}`}
      ></div>

      <span className="text-gray-700">
        (ख) शिकायत
      </span>
    </div>

  </div>
</div>

          {/* 6. Challan - CONDITIONALLY RENDERED */}
         
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-slideDown">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                8. चालान संख्या और नियम-4 के अधीन खर्च के लिए प्रतिभूति जमा करने का दिनांक :
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                    चालान संख्या 
                    
                    </label>
                    <input
                    type="text"
                     placeholder="चालान संख्या दर्ज करें"   
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        errors.challan_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.challanNumber}
                    onChange={(e) => handleFormDataChange('challanNumber', e.target.value)}
                    />
                    {errors.challan_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.challan_number[0]}</p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                    दिनांक 
                    </label>
                    <input
                    type="date"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                        errors.challan_date ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.challanDate}
                    onChange={(e) => handleFormDataChange('challanDate', e.target.value)}
                    />
                    {errors.challan_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.challan_date[0]}</p>
                    )}
                </div>
                </div>

                <div className="p-4 mb-4 rounded">
                <p className="text-gray-700 text-sm mb-2">
                    <strong>टिप्पणी</strong> (1) उक्त धनराशि शीर्षक "8443-सिविल निक्षेप-00-103-प्रतिभूति निक्षेप-00-00" के अधीन भारतीय स्टेट बैंक की किसी भी शाखा में जमा की जा सकती है।
                </p>
                <p className="text-gray-700 text-sm mb-2">
                    (2) किसी "शिकायत" की स्थिति में कोई धनराशि जमा करना अपेक्षित नहीं है।
                </p>
                <p className="text-gray-700 text-sm">
                    (3) चालान की एक प्रति परिवाद के साथ संलग्न की जाए (नियम 8 (2) देखें)।
                </p>
                </div>

                <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                    चालान की प्रति (स्कैन / PDF)
                </label>
                <div className="mt-4 flex items-center gap-4">
                    <label
                    className={`bg-orange-100 text-orange-600 font-semibold px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                        errors.challan_file ? 'border-2 border-red-500' : ''
                    }`}
                    >
                    Choose File
                    <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange('challanFile', e.target.files[0])}
                        accept=".pdf"
                    />
                    </label>
                    <span className="text-gray-500 text-sm">
                    {formData.challanFile ? formData.challanFile.name : 'No file chosen'}
                    </span>
                </div>
                {errors.challan_file && (
                    <p className="text-red-500 text-sm mt-1">{errors.challan_file[0]}</p>
                )}
                </div>
            </div>
        

          {/* 7. Supporting Persons - UPDATED TO DYNAMIC LIST */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              9. ऐसे व्यक्तियों की सूची जिन्होने परिवाद के समर्थन में शपथपत्र दिये हों : 
            </h3>

            <button
                type="button"
                onClick={() => {
                const updated = [
                    ...(Array.isArray(formData.supportingPersons) ? formData.supportingPersons : []),
                    { name: "", address: "" }
                ];
                handleFormDataChange("supportingPersons", updated);
                }}
                className="mb-4 bg-white text-[12px] text-orange-500 border-2 border-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
            >
                + अन्य व्यक्ति जोड़ें
            </button>

            {Array.isArray(formData.supportingPersons) &&
                formData.supportingPersons.map((item, index) => (
                <div
                    key={index}
                    className="border border-gray-200 rounded-lg mb-4 p-4 relative"
                >
                    {formData.supportingPersons.length > 1 && (
                    <button
                        type="button"
                        onClick={() => {
                        const updated = formData.supportingPersons.filter((_, i) => i !== index);
                        handleFormDataChange("supportingPersons", updated);
                        }}
                        className="absolute top-2 right-2 text-red-600 border border-red-600 text-xs px-2 py-1 rounded hover:bg-red-600 hover:text-white"
                    >
                        हटाएँ
                    </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* NAME */}
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                            नाम (व्यक्ति {index + 1}) 
                            </label>
                            <input
                            type="text"
                            placeholder="नाम दर्ज करें"
                                              style={{ height: "48px" }} 

                            className=" kruti-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder:text-xs"
                            value={item.name}
                            onChange={(e) => {
                                const updated = [...formData.supportingPersons];
                                updated[index].name = e.target.value;
                                handleFormDataChange("supportingPersons", updated);
                            }}
                            />

                            {errors[`support_name.${index}`] && (
  <p className="text-red-500 text-sm mt-1">
    {errors[`support_name.${index}`][0]}
  </p>
)}
                        </div>

                        {/* ADDRESS */}
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                            पता 
                            </label>
                            <textarea
                            rows="1"
                            placeholder="पूरा पता लिखें"
                                              style={{ height: "48px" }} 

                            className=" kruti-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none placeholder:text-xs "
                            value={item.address}
                            onChange={(e) => {
                                const updated = [...formData.supportingPersons];
                                updated[index].address = e.target.value;
                                handleFormDataChange("supportingPersons", updated);
                            }}
                            />
                        </div>
                    </div>
                </div>
                ))}
            
            {errors.supporting_affidavit_list && (
              <p className="text-red-500 text-sm mt-1">{errors.supporting_affidavit_list[0]}</p>
            )}
          </div>

          {/* 8. Other Persons */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                10. क्या ऐसे अन्य व्यक्ति भी हैं जिन्हें परिवाद से सम्बन्धित तथ्यों के बारे में जानकारी हो, जिन्हें लोक आयुक्त / उप लोक आयुक्त द्वारा समन करना चाहें । 
              
            </h3>

            <button
                type="button"
                onClick={() => {
                const updated = [
                    ...(Array.isArray(formData.otherPersons) ? formData.otherPersons : []),
                    { name: "", address: "" }
                ];
                handleFormDataChange("otherPersons", updated);
                }}
                className="mb-4 bg-white text-[12px] text-orange-500 border-2 border-orange-500 hover:bg-orange-500 hover:text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
            >
                + अन्य व्यक्ति जोड़ें
            </button>

            {Array.isArray(formData.otherPersons) &&
                formData.otherPersons.map((item, index) => (
                <div
                    key={index}
                    className="border border-gray-200 rounded-lg mb-4 p-4 relative"
                >
                    {formData.otherPersons.length > 1 && (
                    <button
                        type="button"
                        onClick={() => {
                        const updated = formData.otherPersons.filter((_, i) => i !== index);
                        handleFormDataChange("otherPersons", updated);
                        }}
                        className="absolute top-2 right-2 text-red-600 border border-red-600 text-xs px-2 py-1 rounded hover:bg-red-600 hover:text-white"
                    >
                        हटाएँ
                    </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* NAME */}
                    <div className="mb-3">
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                        नाम (व्यक्ति {index + 1}) 
                        </label>
                        <input
                        type="text"
                        placeholder="नाम दर्ज करें"
                                          style={{ height: "48px" }} 

                        className=" kruti-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder:text-xs"
                        value={item.name}
                        onChange={(e) => {
                            const updated = [...formData.otherPersons];
                            updated[index].name = e.target.value;
                            handleFormDataChange("otherPersons", updated);
                        }}
                        />

                        {errors[`support_name.${index}`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`support_name.${index}`][0]}
                          </p>
                        )}
                    </div>

                    {/* ADDRESS */}
                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1">
                        पता 
                        </label>
                        <textarea
                        rows="1"
                        placeholder="पूरा पता लिखें"
                                          style={{ height: "48px" }} 

                        className=" kruti-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none placeholder:text-xs"
                        value={item.address}
                        onChange={(e) => {
                            const updated = [...formData.otherPersons];
                            updated[index].address = e.target.value;
                            handleFormDataChange("otherPersons", updated);
                        }}
                        />
                    </div>

                    </div>
                </div>
                ))}

            {errors.other_witnesses && (
                <p className="text-red-500 text-sm mt-1">
                {errors.other_witnesses[0]}
                </p>
            )}
            </div>

          {/* 9. Attached Documents */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              11. परिवाद से सम्बन्धित संलग्न दस्तावेजों की सूची जिसमें परिवादी का शपथपत्र भी सम्मिलित है। : 
            </h3>

            <textarea
              placeholder="दस्तावेज क्रमवार लिखें वैकल्पिक वास्तविक फाइल नीचे अपलोड करें।"
              rows="3"
              className=" kruti-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y mb-3 placeholder:text-xs"
              value={formData.attachedDocuments}
              onChange={(e) => handleFormDataChange('attachedDocuments', e.target.value)}
            />

            {errors.attached_documents_description && (
  <p className="text-red-500 text-sm mb-2">
    {errors.attached_documents_description[0]}
  </p>
)}


            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label
                className={`bg-orange-50 text-orange-600 font-semibold px-5 py-2.5 rounded-lg cursor-pointer border border-orange-200 hover:bg-orange-100 transition-all duration-200 ${
                  errors.attached_documents ? 'border-red-500' : ''
                }`}
              >
                संलग्न दस्तावेज़ फाइल अपलोड करें
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange('attachedDocumentsFile', e.target.files[0])}
                  accept=".pdf"
                />
              </label>

              <span className="text-gray-500 text-sm ">
                {formData.attachedDocumentsFile
                  ? formData.attachedDocumentsFile.name
                  : 'कोई फाइल नहीं चुनी गई'}
              </span>
            </div>

            {errors.attached_documents && (
              <p className="text-red-500 text-sm mt-2">{errors.attached_documents[0]}</p>
            )}
          </div>

          {/* 10. Complaint Description */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              12. परिवाद का विवरण – (कृपया यहाँ पर परिवाद के सम्पूर्ण तथ्य बतायें)। 
              {/* यदि नीचे दिया गया स्थान अपर्याप्त हो तो अतिरिक्त पृष्ठ जोड़े जा सकते हैं):  */}
            </h3>
            <textarea
              placeholder="सम्पूर्ण विवरण स्पष्ट एवं संक्षेप में लिखें"
              rows="8"
              className={` kruti-input w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-y placeholder:text-xs ${
                errors.complaint_description ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.complaintDescription}
              onChange={(e) => handleFormDataChange('complaintDescription', e.target.value)}
            />
            {errors.complaint_description && (
              <p className="text-red-500 text-sm mt-1">{errors.complaint_description[0]}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              className="bg-gray-600 text-[12px] hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              onClick={handleReset}
            >
              रीसेट
            </button>
            <button
              type="submit"
              className="bg-orange-500 text-[12px] hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              पूर्वावलोकन / सबमिट
            </button>
          </div>
        </form>
      </div>

      {/* PREVIEW MODAL */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print-modal-overlay">
          <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">शिकायत पूर्वावलोकन</h2>
              <div className="flex items-center gap-3">
<button
  onClick={handleDownloadPDF}
  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
>
  पीडीएफ डाउनलोड करें
</button>

<button
  type="button"
  onClick={handlePrint}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
  प्रिंट करें
</button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                >
                  ×
                </button>

                
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-orange-50 px-2 md:px-4 py-4 flex justify-center min-h-0">
              <ComplaintPrintView
                ref={printRef}
                complainants={complainants}
                persons={persons}
                formData={formData}
                districtList={districtList}
              />
            </div>

            <div className="shrink-0 bg-gray-50 px-6 py-3 flex justify-end gap-4 border-t border-gray-200 flex-wrap">

             
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200"
                disabled={isSubmitting}
              >
                संपादित करें
              </button>


               <button
                type="button"
                onClick={handleSaveDraft}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200"
                // disabled={isSubmitting}
                
              >
                {DraftLoader ? "ड्राफ्ट सेविंग...": "ड्राफ्ट सेव करें"}
                
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'सबमिट हो रहा है...' : 'अंतिम सबमिट करें'}
              </button>
            </div>
          </div>
        </div>
      )}



      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .a4-sheet {
          width: 100%;
          min-height: 297mm;
          height: auto !important;
          margin: 0 auto;
          background: linear-gradient(to bottom right, #fff7ed, #ffedd5, #fff7ed) !important;
          display: flow-root;
          overflow: visible;
        }
        @media screen {
          .a4-sheet {
            max-width: 100%;
            min-width: 100%;
          }
        }
        @media print {
          body { margin: 0; }
          .print-modal-overlay { position: static !important; background: none !important; padding: 0 !important; }
          .a4-sheet { transform: scale(1) !important; box-shadow: none !important; border: none !important; width: 210mm; }
        }
      `}</style>
    </div>
  );
};

export default Complaints;
