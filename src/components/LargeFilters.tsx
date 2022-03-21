// Libraries
import React, { useState } from 'react';
import { Formik } from 'formik';
import { ptBR } from 'date-fns/locale';
import { DateRangePicker } from 'react-nice-dates';
import 'react-nice-dates/build/style.css';
import InputRange, { Range } from 'react-input-range';
import 'react-input-range/lib/css/index.css';
// Components
import Input from './Input';
import StarRating from './StarRating';
import { useRouter } from 'next/router';
// Types
import { Filter } from '../@types/general';

interface Props {
  filterValues: Filter;
  closeFilter: Function;
}

interface InitialValues {
  goingTo?: string;
  travelers?: number;
  checkIn?: Date;
  checkOut?: Date;
}

const LargeFilters: React.FC<Props> = ({ filterValues, closeFilter }) => {
  const router = useRouter();

  // State to check submitting filters
  const [isSubmitting, setisSubmitting] = useState(false);

  // Going to filter state
  const [goingToFilter, setGoingToFilter] = useState(
    filterValues.goingTo ? (filterValues.goingTo as string) : undefined
  );
  // Travelers filter state
  const [travelersFilter, setTravelersFilter] = useState(
    filterValues.travelers ? filterValues.travelers : undefined
  );
  // Date filter states
  const [startDate, setStartDate] = useState<Date | null>(
    filterValues.checkIn ? new Date(String(filterValues.checkIn)) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    filterValues.checkOut ? new Date(String(filterValues.checkOut)) : null
  );
  // Price filter state
  const [priceFilter, setPriceFilter] = useState<Range | undefined>(
    filterValues.price
      ? {
          max: Number(filterValues.price[1]),
          min: Number(filterValues.price[0]),
        }
      : {
          max: 999,
          min: 0,
        }
  );
  // Star filter
  const [starsFilter, setStarsFilter] = useState(
    filterValues.stars ? Number(filterValues.stars) : 0
  );

  // Function to get filter action
  function handleFilter(event) {
    event.preventDefault();
    setisSubmitting(true);
    router.push({
      pathname: '/searchHotel',
      query: {
        goingTo: goingToFilter || undefined,
        travelers: travelersFilter || undefined,
        price:
          [String(priceFilter?.min), String(priceFilter?.max)] || undefined,
        stars: String(starsFilter) || undefined,
        checkIn: startDate ? startDate.toISOString() : undefined,
        checkOut: endDate ? endDate.toISOString() : undefined,
      },
    });
    closeFilter(false);
    setisSubmitting(false);
  }

  return (
    <div
      id="filter-conteinter"
      className="flex flex-col w-full py-8 items-center duration-500"
    >
      <form onSubmit={handleFilter} className="flex flex-row">
        <span className="filter-y-line" />
        <div id="left-filter">
          <h1 className="text-[2.5rem] text-black font-bold">Filtros</h1>
          <div className="flex flex-row items-center mt-2 justify-between">
            <div className="flex-col mr-5">
              <p className="filter-text">Indo para</p>
              <div>
                <Input
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setGoingToFilter(event.target.value)
                  }
                  value={goingToFilter}
                  type="text"
                  name="goingTo"
                  placeholder="Ex: Salvador"
                />
              </div>
            </div>
            <div className="flex-col">
              <p className="filter-text">Viajantes</p>
              <div className="w-32">
                <Input
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setTravelersFilter(event.target.value)
                  }
                  value={travelersFilter}
                  type="number"
                  icon="users"
                  name="travelers"
                  placeholder="Ex: 1"
                />
              </div>
            </div>
          </div>
          <DateRangePicker
            startDate={startDate || undefined}
            endDate={endDate || undefined}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            minimumLength={1}
            minimumDate={new Date()}
            format="dd MMM yyyy"
            locale={ptBR}
          >
            {({ startDateInputProps, endDateInputProps, focus }) => (
              <div className="flex flex-row date-range justify-between">
                <div className="flex flex-col">
                  <p className="filter-text">Check in</p>
                  <input
                    className={
                      'border-[#DEDEDE] border-[0.1rem] rounded-xl px-3 py-2 w-40 lg:w-52 duration-500' +
                      (focus === 'startDate' ? ' -focused' : '')
                    }
                    {...startDateInputProps}
                    placeholder="Início"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="filter-text">Check</p>
                  <input
                    className={
                      'border-[#DEDEDE] border-[0.1rem] rounded-xl px-3 py-2 w-40 lg:w-52 duration-500' +
                      (focus === 'endDate' ? ' -focused' : '')
                    }
                    {...endDateInputProps}
                    placeholder="Fim"
                  />
                </div>
              </div>
            )}
          </DateRangePicker>
        </div>

        <span className="filter-y-line" />

        <div id="right-filter">
          <div className="flex flex-col w-full mt-14">
            <p className="filter-text">Preço</p>
            <div className="mt-5 ml-4">
              <InputRange
                maxValue={999}
                minValue={0}
                value={priceFilter || 0}
                formatLabel={value => `R$ ${value}`}
                onChange={value =>
                  setPriceFilter(typeof value !== 'number' ? value : undefined)
                }
              />
            </div>

            <p className="filter-text mt-8">Estrelas</p>
            <div className="mt-[-0.6rem]">
              <StarRating onChange={setStarsFilter} value={starsFilter} />
            </div>
          </div>
        </div>

        <span className="filter-y-line ml-16 xl:ml-28" />

        <div className="absolute bottom-10 left-0 w-full">
          <div className="flex relative lg:w-[55rem] xl:w-[68.5rem] mx-auto px-10 duration-500">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 w-[5rem] h-14 rounded-2xl bg-dark-green text-xl text-white font-bold border-[#00b587] border-b-[0.4rem]"
            >
              FILTRAR
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LargeFilters;