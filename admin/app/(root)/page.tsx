import BookList from '../../components/BookList'
import BookOverview from '../../components/BookOverview'
import { Button } from '../../components/ui/button'
import { sampleBooks } from '../../constants'

const Home = () => {
  return (
    <div>
      <BookOverview  {...sampleBooks[0]}/>

      <BookList
        title="Latest Books"
        books={sampleBooks}
        containerClassName="mt-28"
      />
      <Button>Click Me</Button>
    </div>
  );
};

export default Home;
