import React from 'react';

interface TermsAndPrivacyProps {
    isOpen: boolean;
    onClose: () => void;
    contentType: 'terms' | 'privacy';
    termsContent: string;
    privacyContent: string;
}

const TermsAndPrivacy: React.FC<TermsAndPrivacyProps> = ({ isOpen, onClose, contentType, termsContent, privacyContent }) => {
    if (!isOpen) return null;

    const contentTitle = contentType === 'terms' ? 'Terms and Conditions' : 'Privacy Policy';
    const content = contentType === 'terms' ? termsContent : privacyContent;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6"> 

                <h2 className="text-center text-2xl font-bold text-red-500 mb-4">{contentTitle}</h2>

                <p className="text-sm text-gray-500 mb-2 text-center">
                    {contentType === 'terms' ? 'Last updated: May 21, 2018' : 'Effective Date: May 21, 2018'}
                </p>

                <div className="max-h-96 overflow-y-auto p-4 border border-gray-300 rounded mb-4">
                    <p className="text-sm whitespace-pre-line">{content}</p>
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={onClose}
                        className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsAndPrivacy;
