import HeadingBlock from './blocks/HeadingBlock'
import ParagraphBlock from './blocks/ParagraphBlock'
import CodeBlock from './blocks/CodeBlock'
import VideoBlock from './blocks/VideoBlock'
import MCQBlock from './blocks/MCQBlock'

const BLOCK_COMPONENTS = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  code: CodeBlock,
  video: VideoBlock,
  mcq: MCQBlock,
}

export default function LessonRenderer({ content = [] }) {
  let mcqIndex = 0
  return (
    <div>
      {content.map((block, i) => {
        const Component = BLOCK_COMPONENTS[block.type]
        if (!Component) return null
        if (block.type === 'mcq') mcqIndex += 1
        return <Component key={i} block={block} index={block.type === 'mcq' ? mcqIndex : undefined} />
      })}
    </div>
  )
}
