import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TelegramShareButton,
  RedditShareButton,
  PinterestShareButton
} from 'react-share'

export const ShareButtons = ({ lesson }) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const shareUrl = `${window.location.origin}/lessons/${lesson._id}`
  const shareTitle = lesson.title
  const shareDescription = lesson.description || `Check out this amazing lesson: ${lesson.title}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success('📋 Link copied to clipboard!')
    setShowDropdown(false)
  }

  return (
    <div className="dropdown dropdown-end">
      <button
        className="btn btn-outline gap-2"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <span>↗️</span>
        <span>Share</span>
      </button>
      {showDropdown && (
        <div className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64">
          <div className="p-2 space-y-2">
            {/* Share Buttons Grid */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {/* Twitter */}
              <TwitterShareButton url={shareUrl} title={shareTitle} hashtags={['lifelessons', 'wisdom']}>
                <div className="btn btn-sm btn-ghost w-full h-12 flex items-center justify-center text-xl" title="Twitter">
                  𝕏
                </div>
              </TwitterShareButton>

              {/* Facebook */}
              <FacebookShareButton url={shareUrl} quote={shareTitle}>
                <div className="btn btn-sm btn-ghost w-full h-12 flex items-center justify-center text-lg" title="Facebook">
                  f
                </div>
              </FacebookShareButton>

              {/* LinkedIn */}
              <LinkedinShareButton url={shareUrl} title={shareTitle} summary={shareDescription}>
                <div className="btn btn-sm btn-ghost w-full h-12 flex items-center justify-center text-lg" title="LinkedIn">
                  in
                </div>
              </LinkedinShareButton>

              {/* WhatsApp */}
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <div className="btn btn-sm btn-ghost w-full h-12 flex items-center justify-center text-xl">
                  💬
                </div>
              </WhatsappShareButton>

              {/* Email */}
              <EmailShareButton url={shareUrl} subject={shareTitle} body={shareDescription}>
                <div className="btn btn-sm btn-ghost w-full h-12 flex items-center justify-center text-xl">
                  ✉️
                </div>
              </EmailShareButton>

              {/* Telegram */}
              <TelegramShareButton url={shareUrl} title={shareTitle}>
                <div className="btn btn-sm btn-ghost w-full h-12 flex items-center justify-center text-xl">
                  ✈️
                </div>
              </TelegramShareButton>

              {/* Reddit */}
              <RedditShareButton url={shareUrl} title={shareTitle}>
                <div className="btn btn-sm btn-ghost w-full h-12 flex items-center justify-center text-xl" title="Reddit">
                  🔗
                </div>
              </RedditShareButton>

              {/* Pinterest */}
              <PinterestShareButton url={shareUrl} media={lesson.featuredImage} description={shareTitle}>
                <div className="btn btn-sm btn-ghost w-full h-12 flex items-center justify-center text-xl">
                  📌
                </div>
              </PinterestShareButton>
            </div>

            {/* Divider */}
            <div className="divider my-1"></div>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="btn btn-sm btn-outline w-full gap-2"
            >
              <span>📋</span>
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
