import { useState } from 'react'
import toast from 'react-hot-toast'

export const ShareButtons = ({ lesson }) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const shareUrl = `${window.location.origin}/lessons/${lesson._id}`
  const shareTitle = lesson.title
  const shareText = `${lesson.title} - ${lesson.description}`

  const handleShare = (platform) => {
    let url = ''
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
        break
      case 'copy':
        navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied to clipboard!')
        setShowDropdown(false)
        return
      default:
        return
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
      setShowDropdown(false)
    }
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
        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          <li><a onClick={() => handleShare('twitter')}>🐦 Twitter</a></li>
          <li><a onClick={() => handleShare('facebook')}>👍 Facebook</a></li>
          <li><a onClick={() => handleShare('linkedin')}>💼 LinkedIn</a></li>
          <li><a onClick={() => handleShare('whatsapp')}>💬 WhatsApp</a></li>
          <li><a onClick={() => handleShare('copy')}>📋 Copy Link</a></li>
        </ul>
      )}
    </div>
  )
}
